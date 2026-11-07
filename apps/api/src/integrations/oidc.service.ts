import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  createHash,
  generateKeyPairSync,
  randomBytes,
  randomUUID,
  timingSafeEqual,
} from 'crypto';
import jwt from 'jsonwebtoken';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { DecodedUser } from '../common/types/auth.js';
import { decryptSecret, encryptSecret } from '../common/secrets.js';
import { webUrl } from '../mail/mail.service.js';
import { APP_CATALOG } from './app-catalog.js';

export const sha256 = (value: string) =>
  createHash('sha256').update(value).digest('hex');

const CODE_TTL_MS = 5 * 60 * 1000;
const TOKEN_TTL_S = 60 * 60;
export const DATA_SCOPE = 'school.read';

/** Public base URL of this API, for the issuer and endpoint URLs. */
export const apiUrl = () =>
  (
    process.env.API_PUBLIC_URL || `http://localhost:${process.env.PORT || 5445}`
  ).replace(/\/$/, '');
export const issuer = () => `${apiUrl()}/api/v1/oidc`;

/** OAuth-shaped error that also passes through the global exception filter. */
export function oauthError(
  error: string,
  description: string,
  status = 400,
): never {
  const body = {
    status,
    success: false,
    message: description,
    error,
    error_description: description,
  };
  if (status === 401) throw new UnauthorizedException(body);
  if (status === 403) throw new ForbiddenException(body);
  throw new BadRequestException(body);
}

type App = Prisma.IntegrationAppGetPayload<object>;

/**
 * OpenID Connect provider for the connected apps: authorization code flow
 * (with PKCE) for signing people in, client credentials for the data API.
 */
@Injectable()
export class OidcService {
  constructor(private readonly prisma: PrismaService) {}

  discovery() {
    const base = issuer();
    return {
      issuer: base,
      authorization_endpoint: `${base}/authorize`,
      token_endpoint: `${base}/token`,
      userinfo_endpoint: `${base}/userinfo`,
      jwks_uri: `${base}/jwks`,
      response_types_supported: ['code'],
      grant_types_supported: ['authorization_code', 'client_credentials'],
      subject_types_supported: ['public'],
      id_token_signing_alg_values_supported: ['RS256'],
      scopes_supported: ['openid', 'profile', 'email', DATA_SCOPE],
      token_endpoint_auth_methods_supported: [
        'client_secret_basic',
        'client_secret_post',
      ],
      code_challenge_methods_supported: ['S256'],
      claims_supported: [
        'sub',
        'name',
        'email',
        'picture',
        'penlumen_role',
        'school_uuid',
        'branch_uuids',
        'class',
        'reg_number',
      ],
    };
  }

  // ---------- Signing keys ----------

  /** The newest signing key, created on first use. */
  private async signingKey() {
    const existing = await this.prisma.oidcKey.findFirst({
      orderBy: { created_at: 'desc' },
    });
    const pem = decryptSecret(existing?.private_key);
    if (existing && pem) return { kid: existing.kid, pem };

    const { privateKey, publicKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
    });
    const kid = randomUUID();
    const privatePem = privateKey
      .export({ type: 'pkcs8', format: 'pem' })
      .toString();
    await this.prisma.oidcKey.create({
      data: {
        kid,
        private_key: encryptSecret(privatePem),
        public_jwk: {
          ...publicKey.export({ format: 'jwk' }),
          kid,
          use: 'sig',
          alg: 'RS256',
        } as unknown as Prisma.InputJsonValue,
      },
    });
    return { kid, pem: privatePem };
  }

  async jwks() {
    await this.signingKey();
    const keys = await this.prisma.oidcKey.findMany({
      orderBy: { created_at: 'desc' },
      take: 3,
      select: { public_jwk: true },
    });
    return { keys: keys.map((k) => k.public_jwk) };
  }

  // ---------- Authorization ----------

  private async appForRequest(query: Record<string, any>) {
    const clientId = String(query.client_id || '');
    const app = clientId
      ? await this.prisma.integrationApp.findUnique({
          where: { client_id: clientId },
        })
      : null;
    if (!app || !app.enabled) {
      oauthError('invalid_client', 'Unknown or disabled app');
    }
    const redirectUri = String(query.redirect_uri || '');
    if (!app.redirect_uris.includes(redirectUri)) {
      oauthError(
        'invalid_request',
        'redirect_uri is not registered for this app',
      );
    }
    if (query.response_type !== 'code') {
      oauthError(
        'unsupported_response_type',
        'Only response_type=code is supported',
      );
    }
    const scope = String(query.scope || '');
    if (!scope.split(' ').includes('openid')) {
      oauthError('invalid_scope', 'scope must include openid');
    }
    if (
      query.code_challenge &&
      (query.code_challenge_method || 'plain') !== 'S256'
    ) {
      oauthError('invalid_request', 'code_challenge_method must be S256');
    }
    return { app, redirectUri, scope };
  }

  /**
   * Step 1, from the app: check the request, then hand the person to the web
   * app, which signs them in (if needed) and calls approve().
   */
  async authorizeRedirect(query: Record<string, any>) {
    await this.appForRequest(query);
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (typeof value === 'string') params.set(key, value);
    }
    return `${webUrl()}/oauth/authorize?${params.toString()}`;
  }

  /** Step 2, from the web app with the signed-in person's token. */
  async approve(decoded: DecodedUser, body: Record<string, any>) {
    const { app, redirectUri, scope } = await this.appForRequest(body);
    if (app.school_uuid !== decoded.school_uuid) {
      oauthError('access_denied', 'This app belongs to another school', 403);
    }
    const subjectType =
      (decoded.role as string) === 'STUDENT' ? 'student' : 'user';
    await this.assertCanUse(app, decoded, subjectType);

    const code = randomBytes(32).toString('base64url');
    await this.prisma.oidcCode.create({
      data: {
        code_hash: sha256(code),
        app_uuid: app.uuid,
        subject_uuid: decoded.uuid,
        subject_type: subjectType,
        redirect_uri: redirectUri,
        scope,
        nonce: typeof body.nonce === 'string' ? body.nonce.slice(0, 500) : null,
        code_challenge:
          typeof body.code_challenge === 'string' ? body.code_challenge : null,
        expires_at: new Date(Date.now() + CODE_TTL_MS),
      },
    });
    const target = new URL(redirectUri);
    target.searchParams.set('code', code);
    if (typeof body.state === 'string')
      target.searchParams.set('state', body.state);
    return {
      status: 200,
      success: true,
      message: 'Approved',
      data: {
        redirect_to: target.toString(),
        app_name:
          APP_CATALOG.find((a) => a.key === app.key)?.full_name ?? app.key,
      },
    };
  }

  /** The person must belong to a branch where the app is switched on. */
  private async assertCanUse(
    app: App,
    decoded: DecodedUser,
    subjectType: 'student' | 'user',
  ) {
    let branches: string[] = [];
    if (subjectType === 'student') {
      const student = await this.prisma.student.findFirst({
        where: { uuid: decoded.uuid, status: 'active' },
        select: { branch_uuid: true },
      });
      branches = student ? [student.branch_uuid] : [];
    } else {
      const access = await this.prisma.branchAccess.findMany({
        where: { user_uuid: decoded.uuid, school_uuid: decoded.school_uuid },
        select: { branch_uuid: true },
      });
      branches = access.map((a) => a.branch_uuid);
    }
    if (!branches.some((b) => !app.disabled_branch_uuids.includes(b))) {
      oauthError(
        'access_denied',
        "This app isn't switched on for your branch",
        403,
      );
    }
  }

  // ---------- Token endpoint ----------

  /** client_secret_basic or client_secret_post. */
  async authenticateClient(
    authorization: string | undefined,
    body: Record<string, any>,
  ) {
    let clientId = body.client_id;
    let clientSecret = body.client_secret;
    if (authorization?.startsWith('Basic ')) {
      const decoded = Buffer.from(authorization.slice(6), 'base64').toString();
      const split = decoded.indexOf(':');
      clientId = decodeURIComponent(decoded.slice(0, split));
      clientSecret = decodeURIComponent(decoded.slice(split + 1));
    }
    if (typeof clientId !== 'string' || typeof clientSecret !== 'string') {
      oauthError('invalid_client', 'Client authentication is required', 401);
    }
    const app = await this.prisma.integrationApp.findUnique({
      where: { client_id: clientId },
    });
    const given = Buffer.from(sha256(clientSecret));
    const expected = Buffer.from(app?.client_secret_hash ?? '');
    if (
      !app ||
      !app.enabled ||
      given.length !== expected.length ||
      !timingSafeEqual(given, expected)
    ) {
      oauthError('invalid_client', 'Invalid client credentials', 401);
    }
    return app;
  }

  async token(authorization: string | undefined, body: Record<string, any>) {
    const app = await this.authenticateClient(authorization, body);
    if (body.grant_type === 'client_credentials') {
      return this.issueAccessToken(app, null, null, DATA_SCOPE);
    }
    if (body.grant_type !== 'authorization_code') {
      oauthError(
        'unsupported_grant_type',
        'Use authorization_code or client_credentials',
      );
    }

    const record = await this.prisma.oidcCode.findUnique({
      where: { code_hash: sha256(String(body.code || '')) },
    });
    if (
      !record ||
      record.app_uuid !== app.uuid ||
      record.used_at ||
      record.expires_at < new Date() ||
      record.redirect_uri !== body.redirect_uri
    ) {
      oauthError(
        'invalid_grant',
        'The code is invalid, expired or already used',
      );
    }
    if (record.code_challenge) {
      const verifier = String(body.code_verifier || '');
      const challenge = createHash('sha256')
        .update(verifier)
        .digest('base64url');
      if (challenge !== record.code_challenge) {
        oauthError('invalid_grant', 'code_verifier does not match');
      }
    }
    const claimed = await this.prisma.oidcCode.updateMany({
      where: { id: record.id, used_at: null },
      data: { used_at: new Date() },
    });
    if (!claimed.count)
      oauthError('invalid_grant', 'The code was already used');

    const claims = await this.claims(record.subject_type, record.subject_uuid);
    if (!claims)
      oauthError('invalid_grant', 'This account is no longer active');

    const key = await this.signingKey();
    const idToken = jwt.sign(
      { ...claims, ...(record.nonce && { nonce: record.nonce }) },
      key.pem,
      {
        algorithm: 'RS256',
        keyid: key.kid,
        issuer: issuer(),
        audience: app.client_id,
        expiresIn: TOKEN_TTL_S,
      },
    );
    const access = await this.issueAccessToken(
      app,
      record.subject_uuid,
      record.subject_type,
      record.scope,
    );
    return { ...access, id_token: idToken };
  }

  private async issueAccessToken(
    app: App,
    subjectUuid: string | null,
    subjectType: string | null,
    scope: string,
  ) {
    const token = randomBytes(32).toString('base64url');
    await this.prisma.oidcToken.create({
      data: {
        token_hash: sha256(token),
        app_uuid: app.uuid,
        subject_uuid: subjectUuid,
        subject_type: subjectType,
        scope,
        expires_at: new Date(Date.now() + TOKEN_TTL_S * 1000),
      },
    });
    return {
      access_token: token,
      token_type: 'Bearer',
      expires_in: TOKEN_TTL_S,
      scope,
    };
  }

  /** Looks up a Bearer access token for userinfo and the data API. */
  async resolveToken(authorization: string | undefined) {
    const token = authorization?.startsWith('Bearer ')
      ? authorization.slice(7)
      : '';
    const record = token
      ? await this.prisma.oidcToken.findUnique({
          where: { token_hash: sha256(token) },
          include: { app: true },
        })
      : null;
    if (!record || record.expires_at < new Date() || !record.app.enabled) {
      oauthError(
        'invalid_token',
        'The access token is invalid or expired',
        401,
      );
    }
    return record;
  }

  async userinfo(authorization: string | undefined) {
    const record = await this.resolveToken(authorization);
    if (!record.subject_uuid || !record.subject_type) {
      oauthError('invalid_token', 'This token is not for a person', 401);
    }
    const claims = await this.claims(record.subject_type, record.subject_uuid);
    if (!claims)
      oauthError('invalid_token', 'This account is no longer active', 401);
    return claims;
  }

  /** What apps learn about the signed-in person. */
  private async claims(subjectType: string, uuid: string) {
    if (subjectType === 'student') {
      const student = await this.prisma.student.findFirst({
        where: { uuid, status: 'active' },
        select: {
          uuid: true,
          name: true,
          avatar: true,
          reg_number: true,
          branch_uuid: true,
          class: { select: { uuid: true, name: true } },
          branch: { select: { school_uuid: true } },
        },
      });
      if (!student) return null;
      return {
        sub: student.uuid,
        name: student.name,
        picture: student.avatar,
        penlumen_role: 'student',
        school_uuid: student.branch.school_uuid,
        branch_uuids: [student.branch_uuid],
        class: student.class,
        reg_number: student.reg_number,
      };
    }
    const user = await this.prisma.user.findUnique({
      where: { uuid },
      select: {
        uuid: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        position: true,
        school_uuid: true,
        access: { select: { branch_uuid: true } },
      },
    });
    if (!user) return null;
    return {
      sub: user.uuid,
      name: user.name,
      email: user.email,
      picture: user.avatar,
      penlumen_role:
        user.role === 'PARENT'
          ? 'parent'
          : ['ROOT', 'ADMIN'].includes(user.role)
            ? 'admin'
            : 'staff',
      position: user.position,
      school_uuid: user.school_uuid,
      branch_uuids: [...new Set(user.access.map((a) => a.branch_uuid))],
    };
  }
}
