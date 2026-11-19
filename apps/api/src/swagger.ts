import type { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  type OpenAPIObject,
  SwaggerModule,
} from '@nestjs/swagger';

/** Docs group for each first path segment after /api/v1. */
const TAGS: Record<string, string> = {
  '': 'Health',
  login: 'Auth',
  profile: 'Account',
  register: 'Auth',
  password: 'Auth',
  account: 'Account',
  school: 'School',
  public: 'Public website',
  branch: 'Branches',
  user: 'Staff & parents',
  student: 'Students',
  'student-portal': 'Student portal',
  class: 'Classes',
  subject: 'Subjects',
  grade: 'Grading',
  affective: 'Affective domain',
  result: 'Results & reports',
  attendance: 'Attendance',
  calendar: 'Calendar',
  event: 'Events',
  dashboard: 'Dashboard',
  notification: 'Notifications',
  'billing-template': 'Billing',
  invoice: 'Billing',
  payments: 'Payments',
  parent: 'Parent portal',
  email: 'Email',
  integrations: 'Integrations',
  oidc: 'Integrations: OpenID Connect',
  storage: 'Storage',
};

const BEARER = 'bearer';
const SCHOOL = 'school-token';
const BRANCH = 'branch';

/**
 * Most controllers take an untyped body, so write endpoints get a free-form
 * JSON body (usable from "Try it out"), every operation is grouped by its
 * area, and auth follows the @Public()/@StudentRoute() decorators.
 */
function finish(document: OpenAPIObject) {
  for (const [path, item] of Object.entries(document.paths)) {
    const segments = path.replace(/^\/api\/v1\/?/, '').split('/');
    const tag =
      segments[0] === 'integrations' && segments[1] === 'v1'
        ? 'Integrations: data API'
        : (TAGS[segments[0]] ?? 'Other');

    for (const method of ['get', 'post', 'put', 'patch', 'delete'] as const) {
      const operation = item[method] as Record<string, any> | undefined;
      if (!operation) continue;
      operation.tags = [tag];

      if (operation['x-public']) {
        // The connected-app endpoints authenticate with their own tokens.
        operation.security = tag.startsWith('Integrations')
          ? []
          : [{ [SCHOOL]: [] }];
      }
      if (operation['x-student-route']) {
        operation.description = [
          operation.description,
          'Also open to signed-in students (student portal token).',
        ]
          .filter(Boolean)
          .join('\n\n');
      }
      delete operation['x-public'];
      delete operation['x-student-route'];

      if (method !== 'get' && method !== 'delete' && !operation.requestBody) {
        operation.requestBody = {
          required: false,
          content: {
            'application/json': {
              schema: { type: 'object', additionalProperties: true },
            },
          },
        };
      }
    }
  }
  document.tags = [...new Set(Object.values(TAGS)), 'Integrations: data API']
    .sort()
    .map((name) => ({ name }));
  return document;
}

/**
 * Serves the API docs at /api/docs (JSON at /api/docs-json). On by default
 * outside production; set SWAGGER_ENABLED=true to serve them in production.
 */
export function setupSwagger(app: INestApplication): boolean {
  const enabled =
    process.env.SWAGGER_ENABLED === 'true' ||
    (process.env.NODE_ENV !== 'production' &&
      process.env.SWAGGER_ENABLED !== 'false');
  if (!enabled) return false;

  const config = new DocumentBuilder()
    .setTitle('Penlumen School API')
    .setDescription(
      [
        'Every response is `{ status, success, message, data }`.',
        '',
        'Use **Authorize** to set: the Bearer token from `POST /api/v1/login`,',
        'the `x-school-token` that identifies the school, and `x-branch-session`',
        '(the active branch uuid) for branch-scoped routes.',
        '',
        'Connected apps (LMS, VLS, EMS) use the OpenID Connect and data API',
        'endpoints instead; see docs/integrations.md.',
      ].join('\n'),
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      BEARER,
    )
    .addApiKey({ type: 'apiKey', in: 'header', name: 'x-school-token' }, SCHOOL)
    .addApiKey(
      { type: 'apiKey', in: 'header', name: 'x-branch-session' },
      BRANCH,
    )
    .addSecurityRequirements({ [BEARER]: [], [SCHOOL]: [], [BRANCH]: [] })
    .build();

  const document = finish(SwaggerModule.createDocument(app, config));
  SwaggerModule.setup('api/docs', app, document, {
    jsonDocumentUrl: 'api/docs-json',
    customSiteTitle: 'Penlumen School API',
    swaggerOptions: { persistAuthorization: true, docExpansion: 'none' },
  });
  return true;
}
