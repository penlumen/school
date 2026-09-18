# Penlumen Monorepo

A Turborepo monorepo (Bun as the package manager) containing:

- **`apps/api`** — NestJS backend (converted from the original Express app), Prisma ORM, PostgreSQL
- **`apps/web`** — Next.js frontend (unchanged from the uploaded app)

## Prerequisites

- [Bun](https://bun.sh) v1.4+
- PostgreSQL database (same schema as before — this repo reuses your existing Prisma schema and migration history, so it's safe to point at your current database)

## A note on dependency versions

Every package was updated to its actual latest release, with two deliberate exceptions where "latest" is currently ahead of what the tooling ecosystem supports:

- **TypeScript is pinned to `6.0.3`**, not the `7.0.2` that npm reports as `latest`. TypeScript 7 is the new native (Go-based) compiler, and as of this release it only ships the `tsc` executable — it doesn't yet expose the programmatic compiler API that both the Nest CLI (`nest build`) and `typescript-eslint` depend on. `6.0.3` is the newest version that still has it. Worth revisiting once TS 7.1 restores that API.
- **`prisma` (the CLI) is pinned to `7.10.0`**, matching `@prisma/client`. The `prisma` package's `latest` npm tag currently points at `8.0.0-rc.13`, a release candidate — not something to build on top of for a production app.
- **`apps/web`'s `eslint` is pinned to `9.39.5`**, not `10.10.0`. `eslint-config-next@16` still pulls in `eslint-plugin-react`, which currently crashes (`Converting circular structure to JSON`) when loaded under ESLint 10. This is a known, unresolved ecosystem gap, not a mistake in this config.

Everything else — `@nestjs/*` (→ v12), `@prisma/client`/`@prisma/adapter-pg` (→ 7.10.0), `next` (→ 16), `react`/`react-dom` (→ 19.2), all Radix packages, `pg`, `rxjs`, `axios`, `turbo`, etc. — is on its true latest release.

### NestJS 12 is ESM-only

This was the biggest ripple effect of the update: NestJS 12's packages ship as `"type": "module"` only (no more CommonJS build). `apps/api` is now a proper ESM package (`"type": "module"` in its `package.json`, `module`/`moduleResolution: "nodenext"` in `tsconfig.json`), and every relative import in `src/` was updated to include an explicit `.js` extension (e.g. `from '../common/decorators/public.decorator.js'`), which NodeNext-mode TypeScript requires even though the source files are `.ts`. Nothing about the API's behavior changed — this is purely a module-format migration.

### `next lint` is gone in Next.js 16

Next.js 16 removed the built-in `next lint` command entirely (it was deprecated in 15.5). `apps/web`'s `lint` script now runs `eslint .` directly, and `eslint.config.mjs` was updated to import `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript` directly rather than going through the older `FlatCompat` shim (which is what triggered the ESLint-10 crash mentioned above, and also doesn't work well with this version of `eslint-config-next`).

Running `bun run lint` will surface a batch of pre-existing lint findings from `eslint-plugin-react-hooks`'s newer, stricter rules (`react-hooks/set-state-in-effect`, `react-hooks/purity`, etc.) — these are pointing at real patterns in the original uploaded code (e.g. calling `setState` synchronously inside `useEffect`), not anything introduced by this update. None of them block the build. I left the application code untouched since fixing them is a separate piece of work — let me know if you'd like me to go through them.

## Setup

```bash
bun install

# copy env files and fill in real values
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# generate the Prisma client (needs normal internet access to
# binaries.prisma.sh to download the query/schema engines)
cd apps/api && bun run prisma:generate && cd ../..
```

If you're migrating an existing database, there's nothing to run — `apps/api/prisma/migrations` is byte-for-byte the same history you already had, so your DB is already up to date. For a brand-new database, run:

```bash
cd apps/api && bun run prisma:migrate
```

## Development

```bash
bun run dev
```

This runs both apps in parallel via Turborepo:
- API on `http://localhost:5445` (same port/routes as before, all under `/api/v1`)
- Web on `http://localhost:3000`

## Building

```bash
bun run build
```

## Docker

Runs the whole stack - API, web, Postgres, and Redis - in containers.

```bash
cp .env.example .env   # fill in real values (JWT_SECRET at minimum)
docker compose up --build
```

- API: `http://localhost:5445`
- Web: `http://localhost:3000`
- Postgres: `localhost:5432` (user `admin`, password `password`, db `school`)
- Redis: `localhost:6379`

Migrations run automatically on API container startup (`prisma migrate deploy`). Prisma's client is generated *inside* the build - each Dockerfile's builder stage runs `prisma generate` itself, since the engine binary has to match the container's platform (linux/musl), not your host machine's.

Both `apps/api/Dockerfile` and `apps/web/Dockerfile` build from the **repo root** as their context (`context: .` in `docker-compose.yaml`), since Bun workspaces need the root `package.json`/`bun.lock` to resolve either app's dependencies.

`apps/web` uses Next.js's `standalone` output (`apps/web/next.config.ts`) to keep the image lean — only the traced files actually needed at runtime get shipped, not the full `node_modules` tree. `NEXT_PUBLIC_*` vars are baked into the client bundle at build time, so they're passed as Docker build args (see the `school-frontend` service in `docker-compose.yaml`), not just runtime environment variables.

For a single service:

```bash
docker compose up --build school-backend
docker compose logs -f school-backend
```

To run migrations as a one-off (e.g. before a multi-replica production deploy, instead of on every container start):

```bash
docker compose run --rm school-backend bunx prisma migrate deploy
```

## Project layout

```
apps/
  api/                  NestJS backend
    prisma/             schema.prisma + migrations (unchanged, DB-compatible)
    src/
      main.ts
      app.module.ts
      prisma/           PrismaService (global module)
      common/           JwtAuthGuard, @Public()/@CurrentUser() decorators,
                         global exception filter, hashing service, shared types
      auth/             register, login, profile
      users/  branches/ grades/ classes/ subjects/
      students/ results/ dashboard/ calendar/
  web/                  Next.js frontend (as uploaded)
turbo.json
package.json            workspaces: ["apps/*"]
```

## What changed in the NestJS conversion

- Every route path and response shape (`{ status, success, message, data }`) is preserved exactly, so **the frontend needed no changes** — it talks to the same `/api/v1/...` endpoints with the same headers (`Authorization`, `x-school-token`, `x-branch-session`).
- The old `verifyToken` Express middleware is now a global `JwtAuthGuard`. Routes that were public (register, login, health check) are marked with `@Public()`.
- Controllers are thin; business logic (including all Prisma calls) lives in one `*.service.ts` per resource.
- A global exception filter normalizes thrown `HttpException`s back into the original response shape, so error handling behaves the same as before.
- One bug fix: the old `subject.routes.ts` "show" route read `req.params.suuuid` against a route defined as `:subject_uuid`, so that endpoint's uuid was always `undefined`. Fixed to read the correct param.
- Removed `binaryTargets = ["native", "linux-musl-openssl-3.0.x"]` from `schema.prisma`'s generator block. It was pinning engine binaries for a specific Docker/Alpine target that's no longer part of this repo (the old `Dockerfile`/`docker-compose.yaml` weren't carried over — see below); Prisma will now resolve the correct engine for whatever platform `prisma generate` runs on. If you deploy to an Alpine/musl container later, add the appropriate `binaryTargets` entry back before running `prisma:generate` in that environment.
- Not carried over: the old `Dockerfile`/`docker-compose.yaml` — let me know if you want those recreated for the monorepo.

## Known limitation from this build environment

`prisma generate` requires downloading engine binaries from `binaries.prisma.sh`, which this sandbox's network doesn't allow — so the Prisma client isn't pre-generated in this zip. Everything else (both apps' dependency graphs) was installed and verified to build/bundle cleanly. Run `bun run prisma:generate` inside `apps/api` on your machine before starting the API.

## Figma design

The shared Figma link couldn't be opened directly (Figma blocks automated/bot access), so no UI changes were made against it yet. To align `apps/web` with the completed sections of the design, share either:
- Exported screenshots/frames of the finished sections, or
- Figma Dev Mode access (specs, tokens, measurements)

and I'll implement those sections next.
