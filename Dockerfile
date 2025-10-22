# syntax=docker/dockerfile:1
FROM node:20.11.1-alpine3.19 AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .

FROM base AS builder
RUN npm run build && npm run swagger:gen && npm prune --omit=dev

FROM node:20.11.1-alpine3.19 AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/docs/swagger.json ./docs/swagger.json
EXPOSE 3000
CMD ["node", "dist/server.js"]
