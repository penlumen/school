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

# Generate Prisma Client
RUN bunx prisma generate

EXPOSE 3000

CMD ["sh", "-c", "bun run start:dev"]

############################
# 4. Builder Stage
############################
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN bunx prisma generate

# Build NestJS application (outputs to dist/main.js)
ENV NODE_ENV=production
RUN bun run build

# Install production dependencies only to reduce image size
RUN rm -rf node_modules && bun install --production --frozen-lockfile

############################
# 5. Production Runner Stage
############################
FROM base AS production
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy production node_modules and built NestJS code
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package.json ./

# Run container as non-root user for security
USER bun

EXPOSE 3000

CMD ["bun", "run", "dist/main.js"]