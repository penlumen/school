# Build context is the monorepo root (see docker-compose.yaml), since Bun
# workspaces need the root package.json/bun.lock to resolve apps/web's deps.

FROM oven/bun:1.4-alpine AS base
WORKDIR /app

# --- deps: install once, cached as long as lockfiles don't change ---
FROM base AS deps
COPY package.json bun.lock ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
RUN bun install --frozen-lockfile

# --- builder ---
FROM deps AS builder
COPY apps/web apps/web
COPY turbo.json turbo.json
# Build-time-only public config (NEXT_PUBLIC_* vars get baked into the
# client bundle at build time, so they need to be available here).
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SCHOOL_TOKEN
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SCHOOL_TOKEN=$NEXT_PUBLIC_SCHOOL_TOKEN
RUN cd apps/web && bun run build

# --- runner: standalone output only (see next.config.ts) ---
FROM oven/bun:1.4-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Standalone output is rooted at the monorepo path (apps/web/...) because
# Next traces the whole workspace - see the Next.js docs on "Output File
# Tracing" for monorepos. public/ and .next/static/ aren't included by
# standalone mode and must be copied in separately.
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static

EXPOSE 3000
CMD ["bun", "apps/web/server.js"]
