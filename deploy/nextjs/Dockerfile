# Build stage
FROM node:20-bookworm AS builder
WORKDIR /app
# Enable pnpm via corepack
RUN corepack enable
# Copy lockfile and package manifest first for better caching
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Run stage
FROM node:20-bookworm
ENV NODE_ENV=production
WORKDIR /app
RUN corepack enable
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs
EXPOSE 3000
CMD ["pnpm","start"]


