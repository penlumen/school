# syntax=docker/dockerfile:1

############################
# 1. Base Image
############################
FROM oven/bun:1-alpine AS base
WORKDIR /app

############################
# 2. Dependencies Stage
############################
FROM base AS deps
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

############################
# 3. Builder Stage
############################
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run build

############################
# 4. Runner Stage
############################
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

USER bun

# Copy public folder safely (won't fail if apps/web/public does not exist)
COPY --from=builder /app/apps/web/public* ./public/

# Copy static assets from the built application
COPY --from=builder --chown=bun:bun /app/apps/web/.next/static ./apps/web/.next/static

# Copy the entire standalone monorepo output root
COPY --from=builder --chown=bun:bun /app/.next/standalone ./

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Execute the server entry point generated inside the app directory
CMD ["bun", "run", "apps/web/server.js"]