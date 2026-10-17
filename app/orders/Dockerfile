# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json server.js ./
# Stage 2: Production
FROM node:22-alpine AS production
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder --chown=10001:10001 /app/package.json ./package.json
COPY --from=builder --chown=10001:10001 /app/server.js ./server.js
USER 10001:10001
EXPOSE 3001
CMD ["node", "server.js"]