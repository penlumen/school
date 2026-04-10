FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# IMPORTANT: generate inside builder
RUN pnpm prisma generate

RUN pnpm build


FROM node:20-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

ENV NODE_ENV=production

# Copy everything already built (including Prisma engines)
COPY --from=builder /app ./

EXPOSE 3000

CMD ["node", "dist/server"]