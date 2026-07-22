FROM node:22-alpine AS build
WORKDIR /app
RUN npm install -g pnpm@10.16.1
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/gateway/package.json ./apps/gateway/
COPY apps/main/package.json ./apps/main/
RUN pnpm install --frozen-lockfile
COPY apps/main ./apps/main
RUN pnpm --filter=main build

FROM node:22-alpine AS runner
RUN npm install -g pnpm@10.16.1
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/gateway/package.json ./apps/gateway/
COPY apps/main/package.json ./apps/main/
RUN pnpm install --prod --frozen-lockfile
COPY --from=build /app/apps/main/dist ./apps/main/dist
USER node
WORKDIR /app/apps/main
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD node -e "require('net').createConnection(4000,'localhost').on('connect',()=>process.exit(0)).on('error',()=>process.exit(1))"
CMD ["node", "dist/main.js"]
