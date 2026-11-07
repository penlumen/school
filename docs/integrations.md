# Connecting an app to Penlumen School

Penlumen School is the student management system (SMS). The Learning
Management System (LMS), Virtual Lab System (VLS) and Exam Management System
(EMS) are separate apps, each in its own repository and free to use any
language or framework. This document is the contract between them.

The SMS is the **hub**:

| You need to…                       | Use                                   |
|------------------------------------|---------------------------------------|
| Sign people in                     | OpenID Connect (authorization code + PKCE) |
| Read students, classes, staff      | Data API with a client credentials token |
| Hear about changes as they happen  | Signed webhooks                        |

Nothing here is specific to one language: any standard OIDC client library
and any HTTP client works.

## 1. Getting credentials

A school administrator connects your app in **School Settings › Integrations**:

1. Enters your app's address (where the student dashboard sends people) and
   your **redirect URIs** (exact match, `https://` or `http://localhost`).
2. Clicks **Create client secret** and gives you the **client ID**, the
   **client secret** (shown once) and the **discovery URL**.
3. Optionally sets a **webhook URL**, ticks the events you want and creates a
   **signing secret** (shown once).
4. Ticks the branches the app is for and switches it on.

Until it is switched on, students see the app as *Coming soon*.

Each school has its own client ID and secret. An app serving several schools
stores one set of credentials per school; `school_uuid` in tokens and
payloads tells you which school a request belongs to.

## 2. Signing people in (OpenID Connect)

Discovery: `GET {issuer}/.well-known/openid-configuration`, where the issuer
is `https://<api-host>/api/v1/oidc`. It lists every endpoint below.

1. Send the person to the authorization endpoint:

   ```
   GET {issuer}/authorize
     ?client_id=pl_lms_...
     &redirect_uri=https://learn.example.com/auth/callback
     &response_type=code
     &scope=openid profile email
     &state=<random>
     &nonce=<random>
     &code_challenge=<BASE64URL(SHA256(verifier))>
     &code_challenge_method=S256
   ```

   They sign in to the school portal if they aren't already (staff, parents
   and students all can) and come back to your `redirect_uri` with
   `?code=...&state=...`. There is no consent screen: these are the school's
   own apps.

2. Exchange the code (within 5 minutes, once) at the token endpoint,
   authenticating with `client_secret_basic` or `client_secret_post`:

   ```
   POST {issuer}/token
   Content-Type: application/x-www-form-urlencoded

   grant_type=authorization_code&code=...&redirect_uri=...&code_verifier=...
   ```

   Response: `access_token`, `token_type: Bearer`, `expires_in: 3600`,
   `id_token`.

3. Verify the `id_token` (RS256) against `{issuer}/jwks`: check `iss`, `aud`
   (your client ID), `exp` and `nonce`. `GET {issuer}/userinfo` with the
   access token returns the same claims.

### Claims

| Claim           | Who           | Notes |
|-----------------|---------------|-------|
| `sub`           | everyone      | Stable id: a user uuid, or a student uuid for students |
| `name`, `picture` | everyone    | |
| `email`         | staff, parents | Students have none |
| `penlumen_role` | everyone      | `admin`, `staff`, `parent` or `student` |
| `position`      | staff, parents | e.g. `ADMINISTRATIVE`, `ACADEMIC`, `PARENT` |
| `school_uuid`   | everyone      | |
| `branch_uuids`  | everyone      | Branches they belong to |
| `class`         | students      | `{ uuid, name }` |
| `reg_number`    | students      | |

People are refused (`access_denied`) when the app is off for all of their
branches, or they belong to another school.

## 3. Reading school data (Data API)

Get an app token with client credentials:

```
POST {issuer}/token
Authorization: Basic base64(client_id:client_secret)
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
```

Then call, with `Authorization: Bearer <access_token>`:

| Endpoint | Query |
|----------|-------|
| `GET /api/v1/integrations/v1/school` | — returns the school and its branches |
| `GET /api/v1/integrations/v1/students` | `branch_uuid`, `class_uuid`, `status`, `updated_since`, `page`, `per_page` |
| `GET /api/v1/integrations/v1/classes` | `branch_uuid`, `updated_since`, `page`, `per_page` |
| `GET /api/v1/integrations/v1/staff` | `branch_uuid`, `page`, `per_page` |

Lists return `{ data, page, per_page, total }` (`per_page` up to 200).
Only branches where the app is switched on are visible. Parents, contact
details, fees and passwords are never exposed. Tokens last an hour; replacing
the client secret revokes them all.

Errors use OAuth's shape: `{ error, error_description }` with 400, 401
(`invalid_token`, `invalid_client`) or 403 (`insufficient_scope`,
`access_denied`).

## 4. Webhooks

The SMS POSTs JSON to your webhook URL:

```json
{
  "id": "delivery uuid",
  "event": "student.updated",
  "created_at": "2026-11-07T15:00:00.000Z",
  "school_uuid": "...",
  "branch_uuid": "...",
  "data": { "uuid": "...", "name": "...", "reg_number": "...", "status": "active", "class": { "uuid": "...", "name": "..." } }
}
```

| Event | `data` |
|-------|--------|
| `student.created`, `student.updated` | `uuid, name, reg_number, status, class` |
| `student.deleted` | `uuid` |
| `class.created`, `class.updated` | `uuid, name, status, teacher_uuid, teachers_uuid` |
| `result.published` | `uuid, student_uuid, class_name` |
| `staff.created` | `uuid, name, email, position` |
| `ping` | `message` (from the Send test ping button) |

Headers: `X-Penlumen-Event`, `X-Penlumen-Delivery` (same as `id`) and
`X-Penlumen-Signature: t=<unix seconds>,v1=<hex>`.

**Verify every delivery**: compute HMAC-SHA256 of `"{t}.{raw body}"` with
your signing secret and compare it with `v1` in constant time. Reject
timestamps more than 5 minutes old to stop replays, and use `id` to ignore
duplicates.

Answer with any 2xx within 10 seconds. Otherwise the SMS retries after 30
seconds and 5 minutes, then marks the delivery failed; administrators can
retry it from the delivery log. Webhooks are notifications, not a full sync:
use the Data API with `updated_since` to catch up after downtime.

## 5. Running locally

Run the SMS (`apps/api` and `apps/web`), connect your app on
`http://localhost:<port>` in School Settings › Integrations, and set
`API_PUBLIC_URL` (the issuer's host) and `WEB_APP_URL` in the API's `.env`.
