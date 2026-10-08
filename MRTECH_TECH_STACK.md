# MRTech — Technology Stack

Compiled by reading the repository. Every statement below is traceable to a file,
which is named next to it. Nothing here is inferred from how similar projects are
usually built.

Two labels are used throughout:

- **Current** — present in the codebase today.
- **Planned** — not in the codebase. Listed because this document is also the
  input to a Hostinger KVM VPS migration, and that target needs pieces the repo
  does not yet contain. Planned items are proposals, not descriptions.

No secret values appear in this document. Environment variables are listed by
name only.

---

## 1. Languages & frameworks

| Layer | Technology | Version | Status | Source |
|---|---|---|---|---|
| Frontend | React | ^19.1.1 | Current | `frontend/package.json` |
| Frontend | Create React App (`react-scripts`) | 5.0.1 (pinned) | Current | `frontend/package.json` |
| Frontend | React Router | ^7.9.2 | Current | `frontend/package.json` |
| Backend | Node.js | **not declared** — see risk R1 | Current | no `engines` field in any `package.json` |
| Backend | Express | ^4.18.2 | Current | `backend/package.json` |
| Language | JavaScript (ESM) | — | Current | `backend/package.json` → `"type": "module"` |
| Styling | Hand-written CSS, 25 files | — | Current | `frontend/src/**/*.css` |

There is no TypeScript, no CSS framework and no state-management library in the
dependency list.

**Code size:** 46 `.js`/`.jsx` files and 25 `.css` files under `frontend/src`;
26 first-party `.js` files under `backend/`.

---

## 2. Frontend

- **Build tool:** `react-scripts build` (webpack, via CRA). Not ejected.
- **Routing:** client-side, declared in `frontend/src/App.js`. Express serves
  `index.html` for every unmatched path (`backend/index.js`, `app.get("*")`), so
  deep links work on refresh.
- **Entry point:** `frontend/src/index.js` → `App.js`.
- **Global state:** React Context only — `frontend/src/context/CartContext`.
  The cart is in memory and is **not** persisted (see risk R6).
- **API calls:** relative paths (`/api/...`), so the frontend is same-origin with
  the backend and needs no CORS allowance in normal operation.

### Notable frontend packages

| Package | Version | Used for | Source |
|---|---|---|---|
| `leaflet` + `react-leaflet` | ^1.9.4 / ^5.0.0 | Checkout delivery-location picker | `frontend/src/pages/LocationMap.jsx` |
| `jspdf` | ^4.2.1 | Order invoice PDFs, dynamically imported | `frontend/src/pages/orderPdf.js` |
| `xlsx` | ^0.18.5 | Spreadsheet export | `frontend/package.json` |
| `qrcode.react` | ^4.2.0 | UPI payment QR, rendered client-side | `frontend/src/pages/Checkout.jsx` |
| `framer-motion` | ^12.23.22 | Animation | `frontend/package.json` |
| `react-icons` | ^5.5.0 | Icons | used across pages |
| `lucide-react` | ^0.545.0 | Icons | `frontend/package.json` |
| `axios` | ^1.13.1 | HTTP (native `fetch` is also used) | `frontend/package.json` |

> `frontend/package.json` contains `"proxy": "http://localhost:3000"`. This
> affects `react-scripts start` (dev server) only and has no effect on the
> production build.

---

## 3. Backend

Single Express application. `backend/index.js` does three things:

1. Serves the compiled React app from `frontend/build` as static files, with
   explicit cache headers (`index.html` → `no-cache`; `/static/*` →
   `max-age=31536000, immutable`; everything else → 30 days).
2. Mounts every API router under `/api`.
3. Falls back to `index.html` for any unmatched route.

**One process serves both the site and the API on one port.** There is no
separate frontend server.

### Dependencies

| Package | Version | Used for | Source |
|---|---|---|---|
| `express` | ^4.18.2 | HTTP server | `backend/package.json` |
| `firebase-admin` | ^13.5.0 | Firestore access | `backend/config/firebase.js` |
| `jsonwebtoken` | ^9.0.3 | Admin auth tokens, 7-day expiry | `backend/controllers/authController.js` |
| `bcryptjs` | ^3.0.2 | Password hashing | `backend/controllers/authController.js` |
| `multer` | ^2.0.2 | Product image upload, **memory storage** | `backend/middleware/uploadMiddleware.js` |
| `nodemailer` | ^7.0.10 | Mail transport | `backend/config/email.js` |
| `cors` | ^2.8.5 | CORS | `backend/index.js` |
| `dotenv` | ^17.2.3 | Loads `backend/.env` | `backend/index.js` |

### API surface — 35 endpoints across 8 routers

All are mounted under `/api` (`backend/index.js` lines 63–70).

| Router | Endpoints | Protected |
|---|---|---|
| `authRoutes.js` | 4 | 2 |
| `orderRoutes.js` | 11 | 6 |
| `productRoutes.js` | 7 | 4 |
| `signupOtpRoutes.js` | 4 | 0 |
| `geocodeRoutes.js` | 3 | 0 |
| `passwordResetRoutes.js` | 3 | 0 |
| `demoOtpRoutes.js` | 2 | 0 |
| `enquiryRoutes.js` | 1 | 0 |

Protection is by JWT via `requireAdmin` / `requireSuperAdmin`
(`backend/middleware/authMiddleware.js`). The 11 protected endpoints are the
admin product and order operations. See risk R4 for an unprotected endpoint that
returns customer data.

Additional non-router endpoints in `index.js`: `GET /api/health` (re-probes
Firestore, returns 503 when credentials are rejected) and a setup-admin route.

---

## 4. Database

**Google Cloud Firestore**, reached through the `firebase-admin` SDK. There is
no SQL database, no ORM and no migration tooling in the repository.

### Collections (from `db.collection(...)` call sites)

| Collection | Holds |
|---|---|
| `users` | Customer and admin accounts |
| `admin` | Admin records |
| `products` | Catalogue |
| `productImages` | Product images as base64 + contentType (`productImageController.js`) |
| `orders` | Orders, one document per company sub-order |
| `deleted_orders` | Soft-deleted orders |
| `enquiries` | Contact-form submissions |
| `demoRequests` | Demo requests |

### Credentials

`backend/config/firebase.js` resolves the service account in this order:

1. `FIREBASE_SERVICE_ACCOUNT` — the key JSON as a single-line environment
   variable. **Preferred.**
2. `backend/serviceAccountKey.json` on disk — fallback; logs a warning.

Both are gitignored. `serviceAccountKey.json` is present in the working tree but
not tracked by git.

### Image storage

Product images are **not** written to disk. `multer.memoryStorage()` holds the
upload in memory and `productImageController.js` writes base64 into the
`productImages` collection, served back through `GET /api/product-image/:id`.
The cap is `MAX_IMAGE_BYTES = 700 * 1024` (700 KB raw ≈ 934 KB base64, under
Firestore's 1 MiB per-document limit).

A legacy `/uploads` static mount still exists in `index.js` and a `backend/uploads`
directory is still created, but the current product-image path does not use it.

---

## 5. APIs & integrations

All outbound hosts found in first-party backend code:

| Service | Host | Used for | Env vars | Source |
|---|---|---|---|---|
| Shiprocket | `apiv2.shiprocket.in` | Shipment creation and tracking | `SHIPROCKET_EMAIL`, `SHIPROCKET_PASSWORD` | `controllers/orderController.js` |
| Fast2SMS | `www.fast2sms.com` | OTP SMS over the DLT route | `FAST2SMS_API_KEY`, `FAST2SMS_SENDER_ID`, `FAST2SMS_TEMPLATE_ID`, `FAST2SMS_ENTITY_ID`, `FAST2SMS_OTP_ID` | `config/fast2sms.js` |
| Brevo | `api.brevo.com` | Transactional email | `BREVO_API_KEY`, `ADMIN_EMAIL` | `config/email.js` |
| Nominatim (OpenStreetMap) | `nominatim.openstreetmap.org` | Forward and reverse geocoding, proxied | `NOMINATIM_CONTACT` | `routes/geocodeRoutes.js` |

Called from the browser, not the server:

| Service | Used for | Source |
|---|---|---|
| OpenStreetMap tile servers | Map tiles | `frontend/src/pages/LocationMap.jsx` |
| `unpkg.com` | Leaflet marker icon images | `frontend/src/pages/LocationMap.jsx` |
| India Post (`api.postalpincode.in`) | PIN code → city/state autofill | `frontend/src/pages/Checkout.jsx` |

### Nominatim rate limiting

`routes/geocodeRoutes.js` enforces Nominatim's usage policy server-side, because
every customer shares the server's IP: one global queue with a 1.1 s minimum gap,
a 10-minute response cache, in-flight de-duplication, and 429 handling with
backoff plus a 20 s cooldown. `NOMINATIM_CONTACT` sets the contact address in the
User-Agent and **must be set to a real address** — see risk R3.

### Payments

**There is no payment gateway.** No Razorpay, Stripe, PayU, Cashfree or Paytm SDK
appears anywhere in the repository. Checkout offers COD, a UPI QR rendered
client-side by `qrcode.react`, and a card form. See risk R2.

---

## 6. Environment variables

Names only. Values belong in `backend/.env`, which is gitignored.
`backend/.env.example` is the template.

### Required

| Name | Used by |
|---|---|
| `JWT_SECRET` | `controllers/authController.js`, `middleware/authMiddleware.js` |
| `FIREBASE_SERVICE_ACCOUNT` | `config/firebase.js` (or the key file fallback) |
| `PORT` | `index.js` — defaults to 3000 |

### Integrations

| Name | Used by |
|---|---|
| `BREVO_API_KEY` | `config/email.js` |
| `ADMIN_EMAIL` | `config/email.js` and 6 controllers |
| `FAST2SMS_API_KEY` | `config/fast2sms.js`, `controllers/demoOtpController.js` |
| `FAST2SMS_SENDER_ID` | `config/fast2sms.js`, `controllers/demoOtpController.js` |
| `FAST2SMS_TEMPLATE_ID` | `config/fast2sms.js`, `controllers/demoOtpController.js` |
| `FAST2SMS_ENTITY_ID` | `controllers/demoOtpController.js` |
| `FAST2SMS_OTP_ID` | `config/fast2sms.js` |
| `SHIPROCKET_EMAIL` | `controllers/orderController.js` |
| `SHIPROCKET_PASSWORD` | `controllers/orderController.js` |
| `NOMINATIM_CONTACT` | `routes/geocodeRoutes.js` |
| `FRONTEND_URL` | `controllers/orderController.js` |

### Environment detection

| Name | Used by |
|---|---|
| `NODE_ENV` | `config/firebase.js`, `controllers/demoOtpController.js` |
| `RENDER` | `config/firebase.js`, `controllers/demoOtpController.js` — set automatically by Render |

`ADMIN_PASS` appears in `backend/.env.example` but is not read by any
first-party backend file. `HOST_PORT` is read by `docker-compose.yml` only.

---

## 7. Build & start commands

From `package.json` files. **Current.**

### Root (`package.json`)

```bash
npm run setup    # install backend + frontend deps, then build the frontend
npm run build    # cd frontend && npm run build
npm start        # cd backend && node index.js
npm run dev      # build, then run backend + a watcher that rebuilds on change
```

`npm run dev` uses `concurrently` and `nodemon`; the frontend watcher re-runs the
**production build** rather than starting the CRA dev server.

### Frontend (`frontend/package.json`)

```bash
npm start        # react-scripts start — dev server
npm run build    # react-scripts build — writes frontend/build
npm test         # react-scripts test
```

CRA treats warnings as errors when `CI` is set. The repo builds with warnings, so
CI environments need `CI=false` — the Dockerfile sets this explicitly.

### Backend (`backend/package.json`)

No start script. The server is run directly:

```bash
node index.js
```

`npm test` is the CRA placeholder and exits 1. **There is no backend test suite.**

### Docker (**Current** — files exist; see risk R8)

```bash
docker compose up --build
docker compose down
HOST_PORT=8080 docker compose up    # if 3000 is taken
```

Needs two gitignored files: `backend/.env` and `backend/serviceAccountKey.json`.
Documented in `DOCKER.md`.

---

## 8. Project structure

```
mrtech-main/
├── Dockerfile                  two-stage: build React, then run Express
├── docker-compose.yml          one service, named volume for uploads
├── .dockerignore
├── DOCKER.md                   container usage
├── README.md
├── TECHNICAL_GAP_ANALYSIS.md
├── package.json                orchestration scripts only
│
├── backend/                    Express API + static host (ESM)
│   ├── index.js                entry: static serving, routes, SPA fallback
│   ├── config/                 firebase.js, email.js, fast2sms.js
│   ├── controllers/            order, product, auth, OTP, enquiry, password reset
│   ├── middleware/             authMiddleware.js (JWT), uploadMiddleware.js (multer)
│   ├── routes/                 8 routers, all mounted at /api
│   ├── utils/
│   ├── uploads/                legacy static mount; current images go to Firestore
│   ├── serviceAccountKey.json  gitignored, not tracked
│   └── package.json
│
└── frontend/                   Create React App
    ├── public/                 static assets, including /images/*
    ├── src/
    │   ├── App.js              all routes
    │   ├── components/         Navbar, Footer
    │   ├── context/            CartContext
    │   ├── pages/              46 js/jsx files, 25 css files
    │   │   └── legal/          privacy, terms, refund, cancellation
    │   └── assets/
    ├── build/                  COMMITTED — 204 files tracked in git (risk R5)
    └── package.json
```

---

## 9. Production architecture

### Current

```
                      Internet
                         │
                         ▼
              ┌──────────────────────┐
              │  Render (managed)    │   TLS terminated by the platform
              │  Node process        │
              │  express :$PORT      │
              │   ├── /api/*  routers│
              │   ├── /static/* CRA  │
              │   └── *       SPA    │
              └──────────┬───────────┘
                         │
      ┌──────────────────┼────────────────────┐
      ▼                  ▼                    ▼
  Firestore         Fast2SMS / Brevo      Shiprocket
  (Google)          (SMS / email)         (shipping)
                         │
                         ▼
                  Nominatim (OSM)
                  via /api/geocode proxy
```

Evidence for Render: `config/firebase.js` and `controllers/demoOtpController.js`
branch on the `RENDER` environment variable, which the platform sets; comments in
`index.js` and `Dockerfile` refer to Render's health check and ephemeral disk.

Single process, single port. No reverse proxy, no process manager, no load
balancer and no CDN configured in the repository. Comments in `index.js` mention
Cloudflare sitting in front in production, but nothing in the repo configures it.

### Planned — Hostinger KVM VPS

```
            Internet (443/80)
                    │
                    ▼
        ┌───────────────────────┐
        │ nginx  :80 → :443     │  TLS (Let's Encrypt), gzip,
        │ reverse proxy         │  security headers, static caching
        └───────────┬───────────┘
                    │ proxy_pass 127.0.0.1:3000
                    ▼
        ┌───────────────────────┐
        │ PM2 → node index.js   │  cluster or fork, restart on boot
        │ express :3000         │
        └───────────┬───────────┘
                    ▼
      Firestore + Fast2SMS + Brevo + Shiprocket + Nominatim
```

Express would keep serving the built React app, as it does now; nginx adds TLS,
compression and headers. Alternatively nginx serves `frontend/build` directly and
proxies only `/api` — slightly faster, but it means the static path is no longer
the one exercised in development.

---

## 10. Hostinger KVM VPS requirements — **Planned**

Nothing in the repository targets a VPS. The figures below are derived from what
the code actually does, with the reasoning shown, not from a generic template.

### Sizing

| Resource | Recommendation | Why |
|---|---|---|
| Plan | KVM 2 (2 vCPU, 8 GB RAM) | See the build note below |
| RAM | 8 GB | The CRA production build is the peak. On this project it has already failed with `Zone Allocation failed — process out of memory` on a machine with ~1.2 GB free, and needs `NODE_OPTIONS=--max-old-space-size=3072` to be safe. KVM 1 (4 GB) can work **only if the build happens elsewhere**. |
| Disk | 50 GB SSD | Repo plus `node_modules` for both halves; images live in Firestore, not on disk |
| OS | Ubuntu 22.04 LTS or 24.04 LTS | Both ship glibc, matching the `bookworm-slim` base already chosen for `firebase-admin`'s gRPC dependency |
| Node | **20 LTS or 22 LTS** | `react-router-dom` 7 and `firebase-admin` 13 both require Node ≥ 20. The Dockerfile pins 20. Local development is currently on v24.12.0 — see risk R1 |

**Building on the VPS is the single largest resource question.** Two options:

1. Build on the VPS — needs the RAM above.
2. Build in CI or locally and ship `frontend/build`. The repo already commits
   `frontend/build`, so this works today with no extra tooling (risk R5 covers
   the trade-off).

### Outbound network

The VPS must reach, over HTTPS: `firestore.googleapis.com` and related Google
endpoints, `apiv2.shiprocket.in`, `www.fast2sms.com`, `api.brevo.com`,
`nominatim.openstreetmap.org`.

---

## 11. nginx, PM2, SSL & ports — **Planned**

No nginx config, PM2 ecosystem file or systemd unit exists in the repository.
This section is a specification to be written, not a description.

### Ports

| Port | Role | Status |
|---|---|---|
| 3000 | Express default (`PORT` env overrides) | Current — `index.js`, Dockerfile, compose |
| 80 | nginx, redirect to 443 | Planned |
| 443 | nginx TLS | Planned |

On a VPS the Node process should bind **127.0.0.1:3000**, not `0.0.0.0`, so only
nginx can reach it. `index.js` currently calls `app.listen(PORT)` without a host
argument, which binds all interfaces — a firewall rule is required if the bind is
left as is.

### nginx

Required behaviours: terminate TLS; redirect 80 → 443; `proxy_pass` to
`127.0.0.1:3000` with `Host`, `X-Real-IP`, `X-Forwarded-For` and
`X-Forwarded-Proto` set; `client_max_body_size` at least **1 MB** for product
image uploads (`MAX_IMAGE_BYTES` is 700 KB raw, and multipart overhead sits on
top); gzip for text types.

Express already sets long-lived cache headers on `/static/*` and `no-cache` on
`index.html`, so nginx should **pass those through** rather than override them.

### SSL

Let's Encrypt via certbot with the nginx plugin, auto-renewed by its systemd
timer. The repository contains no certificate handling — TLS is entirely the
proxy's job.

### PM2

Needs an ecosystem file (`cwd` must be `backend/`, because `index.js` resolves
the frontend as `path.resolve(__dirname, "..", "frontend", "build")`), plus
`pm2 startup` and `pm2 save` for boot persistence.

**PM2 cluster mode is not safe for this codebase as written.** The Nominatim
throttle in `routes/geocodeRoutes.js` is module-level state — one queue, one
cache, one cooldown *per process*. Four cluster workers become four independent
throttles and four times the request rate to Nominatim, which is what the 1.1 s
gap exists to prevent. Use **fork mode with a single instance**, or move the
throttle into shared storage before scaling out.

---

## 12. Deployment risks & issues

Ordered by how much trouble each causes on a VPS migration. Every one is a fact
about the current code, not a hypothetical.

**R1 — No Node version is declared.** No `engines` field anywhere. The Dockerfile
pins Node 20, local development runs v24.12.0, and the VPS will use whatever is
installed. Three different runtimes for one codebase. *Fix: add `engines` to both
`package.json` files and an `.nvmrc`.*

**R2 — Non-COD orders are marked paid without any gateway.**
`orderController.js`: `paymentStatus: paymentMethod === "COD" ? "pending" : "paid"`.
There is no payment gateway in the repository, so a UPI or card order is recorded
as paid on the customer's word alone. This is a commercial exposure, not a
technical one, and it does not change on a VPS — but it should be a conscious
decision before more traffic arrives.

**R3 — `NOMINATIM_CONTACT` must be set.** It defaults to a placeholder address.
Nominatim's usage policy requires a real contact in the User-Agent, and a missing
or bogus one is grounds for blocking the server's IP. Every customer shares that
IP. *Outstanding on the current deployment too.*

**R4 — `GET /api/orders/customer/:email` has no authentication.** Anyone who
guesses an email address can read that customer's order history, including the
delivery address and coordinates. The `/recent` and `/stats` variants are also
open. *Fix before the migration, not after.*

**R5 — `frontend/build` is committed (204 files).** Convenient — it lets a VPS
deploy skip the build step entirely — but every deploy produces a large,
unreviewable diff, and the tree can disagree with `frontend/src` if someone
forgets to rebuild. Decide deliberately: keep it as the deploy artefact, or
gitignore it and build in CI.

**R6 — The cart is not persisted.** `CartContext` holds it in memory only, so a
page refresh empties it. This is a conversion problem on any host.

**R7 — CORS is fully open.** `app.use(cors())` with no options allows every
origin. The frontend is same-origin, so this permissiveness buys nothing and
should be narrowed to the production domain.

**R8 — Docker is defined but has never been run here.** `Dockerfile`,
`docker-compose.yml` and `DOCKER.md` are complete and consistent with the code,
but no image has been built in this environment, so the files are unverified.
Build once before relying on them.

**R9 — No automated tests.** `backend` has no test script; `frontend` has the CRA
default. Every regression surfaces manually.

**R10 — PM2 cluster mode breaks the Nominatim throttle.** Covered in §11. Noted
separately because it is easy to enable by reflex when setting PM2 up.

**R11 — The legacy `/uploads` path is ephemeral.** `index.js` still serves
`backend/uploads` statically, and Render's disk is wiped on deploy — the reason
product images were moved into Firestore. On a VPS the directory would persist,
which quietly changes the behaviour. Either remove the mount or give it a real
backup story.

---

*Generated from the repository. No code was modified and no secrets are included.*
