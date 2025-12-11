# Build Client (Vite)
FROM oven/bun:latest AS client-build

WORKDIR /app/client

COPY client/package.json client/bun.lock ./

RUN bun install

COPY client/ ./

RUN bun run build


# Build Server (tsc)
FROM node:22 AS server-build

WORKDIR /app/server

COPY server/package.json server/package-lock.json ./

RUN npm install

COPY server/ ./

RUN npm run build


# Runtime image
FROM node:22

WORKDIR /app

# Copy transpiled server code
COPY --from=server-build /app/server/dist ./server/dist

COPY --from=server-build /app/server/package*.json ./server/

COPY --from=server-build /app/server/node_modules ./server/node_modules

# Copy bundled client code
COPY --from=client-build /app/client/dist/ ./client/dist

# Switch to non-root user (node)
USER node

WORKDIR /app/server

ENV NODE_ENV=production

ENV PORT=5000

EXPOSE 5000

CMD ["node", "dist/index.js"]
