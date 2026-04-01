#Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY tsconfig.base.json ./


COPY apps/service-b ./apps/service-b
COPY shared ./shared


RUN pnpm install --frozen-lockfile


RUN pnpm --filter @all/shared build

RUN pnpm --filter service-b build


# Stage 2: Runner
FROM node:18-alpine AS runner
WORKDIR /app

RUN corepack enable


COPY --from=builder /app/apps/service-b ./apps/service-b
COPY --from=builder /app/shared ./shared


COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml


RUN pnpm install --prod --filter service-b... --ignore-scripts


COPY --from=builder /app/apps/service-b/dist ./apps/service-b/dist

ENV NODE_ENV=production
EXPOSE 9100
CMD ["node", "apps/service-b/dist/server.js"]