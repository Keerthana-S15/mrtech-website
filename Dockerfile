# syntax=docker/dockerfile:1

# =============================================================================
# MRTech — production image
#
# Mirrors how the app runs on Render: the React app is compiled to static files
# and the Express server serves BOTH those files and the /api routes from a
# single port. One container, one port, no nginx needed.
#
# Node 20 LTS is pinned deliberately. Nothing in the repo declares an "engines"
# field, so without a pin each machine builds on whatever Node it happens to
# have (this repo has been built on Node 24 locally). react-router-dom 7 and
# firebase-admin 13 both require Node >= 20, so 20 is the real floor.
#
# bookworm-slim (glibc) rather than alpine (musl): firebase-admin pulls in gRPC
# and the Alpine builds of that stack are the usual source of "works on my
# machine" failures. The size difference is not worth that risk here.
# =============================================================================


# ---------- Stage 1: compile the React frontend ----------
FROM node:20-bookworm-slim AS frontend-build

# create-react-app treats warnings as errors when CI is set, and CI is set by
# default on most build servers. The repo currently builds with warnings, so
# pin this to false to keep the Docker build identical to `npm run build`.
ENV CI=false

WORKDIR /app/frontend

# Copy manifests first so this layer is cached until dependencies change.
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build


# ---------- Stage 2: runtime ----------
FROM node:20-bookworm-slim AS runtime

ENV NODE_ENV=production \
    PORT=3000

# index.js resolves the frontend as path.resolve(__dirname, "..", "frontend",
# "build"), so the backend must live at /app/backend for /app/frontend/build
# to be found.
WORKDIR /app/backend

COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY backend/ ./

# Only the compiled output comes across — no frontend sources or node_modules.
COPY --from=frontend-build /app/frontend/build /app/frontend/build

# Admin-panel uploads land here. docker-compose mounts a named volume over it
# so the files survive `docker compose down`; the mkdir keeps the path valid
# when the image is run without that volume.
RUN mkdir -p /app/backend/uploads && chown -R node:node /app

# Drop root — the server never needs it.
USER node

EXPOSE 3000

# Liveness only: "is the server answering?". Firestore status is reported
# separately by /api/health, which returns 503 when credentials are rejected —
# that is a real signal, but it should not restart a healthy web server.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "index.js"]
