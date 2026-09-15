# Build context is the monorepo root (see docker-compose.yaml), since Bun
# workspaces need the root package.json/bun.lock to resolve apps/api's deps.

FROM oven/bun:1.4-alpine AS base
WORKDIR /app
# Prisma's query engine needs OpenSSL present on the system, both to detect
# the right engine at `prisma generate` time and to actually run it later.
RUN apk add --no-cache openssl

# --- deps: install once, cached as long as lockfiles don't change ---
FROM base AS deps
COPY package.json bun.lock ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
RUN bun install --frozen-lockfile

# --- builder: generate the Prisma client and compile ---
FROM deps AS builder
COPY apps/api apps/api
COPY turbo.json turbo.json
# IMPORTANT: generate inside the builder - the engine binary matches this
# image's platform (linux/musl), which won't match your host machine's.
RUN cd apps/api && bunx prisma generate
RUN cd apps/api && bun run build

# --- runner: only what's needed to actually run the compiled API ---
FROM oven/bun:1.4-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl
ENV NODE_ENV=production

# Bun workspaces don't fully hoist dependencies to the root node_modules -
# apps/api/node_modules holds relative symlinks (e.g.
# ../../../../node_modules/.bun/@nestjs+core@.../...) into the root
# node_modules/.bun content store. Both directories have to be copied
# together, preserving this same relative layout, or those symlinks break.
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/apps/api/prisma.config.ts ./apps/api/prisma.config.ts
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json

WORKDIR /app/apps/api
EXPOSE 5445
# Applies any pending migrations against DATABASE_URL before starting -
# fine for this project's scale; for multi-replica production deploys,
# run `docker compose run --rm school-backend bunx prisma migrate deploy`
# as a separate one-off step instead and drop the migrate part here.
CMD ["sh", "-c", "bunx prisma migrate deploy && bun dist/main.js"]
