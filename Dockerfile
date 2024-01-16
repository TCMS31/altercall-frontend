# syntax=docker/dockerfile:1

# ---- Stage 1: build ---------------------------------------------------------
# Vite inlines VITE_* values at build time, so configuration has to arrive as
# build args rather than runtime environment variables.
FROM node:22-alpine AS build

ARG VITE_GRAPHQL_URI=http://localhost:8000/graphql
ARG VITE_COACH_API_URL=""
ARG VITE_COACH_TIMEOUT_MS=12000

ENV VITE_GRAPHQL_URI=$VITE_GRAPHQL_URI \
    VITE_COACH_API_URL=$VITE_COACH_API_URL \
    VITE_COACH_TIMEOUT_MS=$VITE_COACH_TIMEOUT_MS

WORKDIR /app

# Dependencies first so the layer caches across source changes.
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build

# ---- Stage 2: runtime -------------------------------------------------------
FROM nginx:1.27-alpine AS runtime

# Listen on an unprivileged port so the server can drop to a non-root user.
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

# nginx needs to own its cache, log and pid locations to run as a non-root user.
RUN touch /var/run/nginx.pid \
    && chown -R nginx:nginx /var/run/nginx.pid /var/cache/nginx /var/log/nginx /usr/share/nginx/html

USER nginx
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q --spider http://127.0.0.1:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
