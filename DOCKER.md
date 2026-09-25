# Running MRTech with Docker

The container runs the app exactly the way production does: the React app is
compiled to static files and Express serves **both** those files and the
`/api` routes from **one port**. There is no separate frontend container and
no nginx.

Node 20 LTS is pinned in the image, so it no longer matters which Node version
is installed on your machine.

---

## 1. One-time setup

You need two files that are deliberately **not** in git, because they hold
secrets. Ask the team lead for the values.

```bash
# from the repo root
cp backend/.env.example backend/.env
```

Then fill in `backend/.env`, and place the Firebase service-account key at:

```
backend/serviceAccountKey.json
```

> Both are listed in `.gitignore` **and** `.dockerignore`, so they are never
> committed and never copied into an image layer. They are supplied to the
> running container at runtime instead.

If `backend/serviceAccountKey.json` does not exist, Docker will silently create
an empty **directory** at that path and the server will fail to start with a
JSON parse error. If you see that, check the file is really there.

---

## 2. Build and run

```bash
docker compose up --build
```

Then open <http://localhost:3000>.

That single command builds the image (installs dependencies, compiles the
frontend) and starts the server. First build takes a few minutes; later builds
reuse cached layers and are much faster.

### Everyday commands

```bash
docker compose up                  # start (no rebuild)
docker compose up -d               # start in the background
docker compose logs -f             # follow the logs
docker compose restart             # restart the server
docker compose down                # stop and remove the container
docker compose up --build          # rebuild after pulling new code
```

### Port already in use

The container always listens on 3000 internally; only the host side changes:

```bash
HOST_PORT=8080 docker compose up --build     # then use http://localhost:8080
```

### A genuinely clean build

Use this when you suspect a stale layer:

```bash
docker compose build --no-cache
docker compose up
```

To also throw away uploaded files (see "Uploads" below):

```bash
docker compose down -v
```

### Without compose

```bash
docker build -t mrtech:latest .

docker run --rm -p 3000:3000 \
  --env-file backend/.env \
  -e NODE_ENV=production -e PORT=3000 \
  -v "$(pwd)/backend/serviceAccountKey.json:/app/backend/serviceAccountKey.json:ro" \
  -v mrtech_uploads:/app/backend/uploads \
  mrtech:latest
```

On Windows PowerShell, replace `$(pwd)` with `${PWD}`.

---

## 3. Checking it works

```bash
curl http://localhost:3000/api/health     # {"status":"ok","firestore":{"ok":true},...}
curl http://localhost:3000/api/products   # should list the products
```

`/api/health` returns **503** with `"status":"degraded"` when Firestore rejects
the credentials. That means the service-account key is wrong, revoked or not
mounted — the web server itself is still fine. The container's healthcheck
deliberately does not use this endpoint, so a Firestore problem does not cause
a restart loop.

`docker compose ps` shows the container as `healthy` once the server answers.

---

## 4. Uploads

Product images added through the admin panel are written to
`/app/backend/uploads`. That path is a named Docker volume (`mrtech_uploads`),
so the files survive `docker compose down` and rebuilds. They are removed only
by `docker compose down -v`.

> Worth knowing: on Render this directory is **not** persistent. Anything
> uploaded through the admin panel there is wiped on the next deploy, which is
> why two product images had to be committed to the repo instead. Moving
> uploads to external storage (S3, Cloudinary) or a Render persistent disk is
> still an open item — Docker fixes this locally, not in production.

---

## 5. Environment variables

All of them live in `backend/.env`; `docker-compose.yml` passes the file
through with `env_file`. `NODE_ENV` and `PORT` are set by compose afterwards
and override anything in the file.

See `backend/.env.example` for the full list with comments.

Firebase credentials work two ways, and `config/firebase.js` prefers the first:

1. `FIREBASE_SERVICE_ACCOUNT` — the whole key JSON on one line. This is what
   Render uses.
2. `backend/serviceAccountKey.json` mounted read-only. This is the
   docker-compose default because it is easier to work with locally.

---

## 6. Developing without Docker

Docker is for a consistent, production-shaped run. Nothing about the existing
local workflow changed:

```bash
npm run setup     # install backend + frontend deps, build the frontend
npm run dev       # backend + frontend rebuild on change
```

Note that the image serves a **compiled** frontend, so editing `frontend/src`
while the container is running has no effect until you rebuild. For day-to-day
UI work, `npm run dev` is still the faster loop.
