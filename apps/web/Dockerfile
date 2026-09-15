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
# 3. Development Stage
############################
FROM base AS development
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["bun", "run", "dev"]

############################
# 4. Builder Stage
############################
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run build

############################
# 5. Production Runner Stage
############################
FROM base AS production
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Use non-root user
USER bun

# Copy built standalone assets from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=bun:bun /app/.next/standalone ./
COPY --from=builder --chown=bun:bun /app/.next/static ./.next/static

EXPOSE 3000

CMD ["bun", "run", "server.js"]