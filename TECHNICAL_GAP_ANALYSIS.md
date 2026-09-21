# Technical Gap Analysis — MR Tech Platform (mythrealitytech.com)

| | |
|---|---|
| **Scope** | Full codebase review: `backend/`, `frontend/src/`, repository configuration, Git history, and the live Firestore data (read-only) |
| **Date** | 18 September 2026 |
| **Method** | Static review of every live (uncommented) source file, dependency and environment-variable usage tracing, Git history inspection, read-only Firestore queries, and live HTTP probes against production |
| **Severity scale** | **Critical** — active exploit / data loss / revenue loss path · **High** — must fix before scaling · **Medium** — degrades quality or reliability · **Low** — hygiene |
| **Effort scale** | **S** < 1 day · **M** 1–5 days · **L** > 1 week |

> **Note on already-fixed items.** During this review a production outage was diagnosed and fixed (committed 17 Sep 2026 as `fc9eed9` and `5efe91d`): a revoked Firebase key made every DB route return 500, which the storefront masked as "No products found". Those fixes — the `/api/health` route, the Firestore startup probe in `config/firebase.js`, explicit loading/error states in `Purchase.jsx`, the corrected `.gitignore`, and un-tracking `serviceAccountKey.json` — are reflected below as **RESOLVED (fc9eed9)** so they are not double-counted.

---

## Summary

| Category | Critical | High | Medium | Low | Total |
|---|---|---|---|---|---|
| 1. Security | 5 | 7 | 6 | 2 | 20 |
| 2. Bugs (functional defects) | 1 | 4 | 4 | 1 | 10 |
| 3. Missing features | 0 | 3 | 6 | 2 | 11 |
| 4. Performance & scalability | 0 | 1 | 7 | 2 | 10 |
| 5. Dead / unused code & dependencies | 0 | 0 | 4 | 6 | 10 |
| 6. Integrations | 0 | 2 | 2 | 1 | 5 |
| 7. Production readiness (DevOps, testing, observability) | 0 | 6 | 6 | 3 | 15 |
| 8. UX, accessibility, SEO & compliance | 0 | 1 | 6 | 1 | 8 |
| 9. Documentation | 0 | 1 | 3 | 1 | 5 |
| **Total** | **6** | **25** | **44** | **19** | **94** |

### Actual architecture (differs from internal documentation)

- **One** Render web service, not two. `backend/index.js` serves the compiled React build via `express.static` and a `*` catch-all; the frontend calls a relative `/api`. There is no separately hosted static site.
- Database is **Cloud Firestore** (`admin.firestore()`), not Firebase Realtime Database.
- Authentication has two OTP paths — Fast2SMS mobile OTP **and** an email OTP — plus email/password login issuing 7-day JWTs.
- Email is sent through the **Brevo HTTP API** (`config/email.js`); the `nodemailer` dependency is installed but unused.
- Payments are a static UPI QR code with no gateway.

---

## 1. Security

| ID | Severity | Issue | Affected file / function | Impact | Suggested fix | Effort |
|---|---|---|---|---|---|---|
| SEC-01 | **Critical** | **Firebase service-account private key committed to Git history.** `backend/serviceAccountKey.json` (key id `a19bfb8b…`) has been in every commit since `7d3f474 initial commit`. The `.gitignore` entry meant to exclude it was appended as UTF-16 and never matched. Remote is `github.com/Keerthana-S15/mrtech-website`. The key has since been revoked (Google now rejects it), but it remains in history. | `.gitignore`, `backend/serviceAccountKey.json`, Git history | Anyone with repo read access held full admin rights over the production database for the lifetime of that key. | **RESOLVED in `fc9eed9`** (file untracked, `.gitignore` rewritten). Still required: purge from history with `git filter-repo --path backend/serviceAccountKey.json --invert-paths`, force-push, and confirm repo visibility. Never place the replacement key in the repo. | S |
| SEC-02 | **Critical** | **Unauthenticated admin creation.** `POST /api/setup-admin` accepts `{email, password}` from anyone and writes `userType: "admin"` into `users`. `login()` honours that field and mints an admin JWT. | `backend/index.js:41-71` | Any caller gains product CRUD, all-orders read, and order-status write. | Delete the route. Seed admins with a local script. Audit `users` for `userType == "admin"` docs not created deliberately. | S |
| SEC-03 | **Critical** | **Order totals trusted from the client.** `groupSubtotal` is computed from `i.price * i.quantity` where `price` comes from `req.body.items`. The product doc is fetched but only `companyId` is read from it. | `orderController.js` → `createOrder()` ~L1553 | A crafted request purchases any item for ₹1. Direct revenue loss. | Use `productDoc.data().price`; recompute subtotal/tax/shipping server-side; reject if client total mismatches. | S |
| SEC-04 | **Critical** | **Orders marked "paid" with no verification.** `paymentStatus: paymentMethod === "COD" ? "pending" : "paid"`. Non-COD orders are recorded as paid on submission; payment is a static UPI QR with no callback. | `orderController.js` → `createOrder()` ~L1571 | Goods may ship against unpaid orders; no reconciliation trail. | Add `awaiting_verification` state with admin confirmation now; replace with gateway webhook (Razorpay/Cashfree) later. | M |
| SEC-05 | **Critical** | **Customer PII readable without authentication.** `/orders/customer/:email`, `/orders/customer/:email/stats`, `/orders/customer/:email/recent`, `/orders/track/:orderId` have no auth. | `routes/orderRoutes.js:74-79`; `getOrdersByCustomer`, `getCustomerStats`, `getRecentOrders`, `trackOrder` | Iterating email addresses yields names, phones, full shipping addresses and order history. Reportable breach exposure under the DPDP Act 2023. | Add `requireCustomer` middleware verifying the customer JWT; derive email from the token, ignore the URL param. Order tracking by ID should require email+orderId or a signed link. | M |
| SEC-06 | High | **No rate limiting on any route.** `express-rate-limit` not installed. | `backend/index.js` (global), all OTP/login/enquiry routes | OTP brute force, SMS-cost abuse (each `send-phone-otp` bills a Fast2SMS credit), login credential stuffing, enquiry spam. | `express-rate-limit`: 5 OTP sends / hour / phone, 5 verify attempts / OTP, 10 logins / 15 min / IP, 10 enquiries / hour / IP. | S |
| SEC-07 | High | **Email OTP brute-forceable and logged in cleartext.** 6-digit code stored in a plain in-memory object with no attempt counter; `console.log(... ${otp})` prints it. Same pattern in the demo-request flow. | `signupOtpController.js:5,43`; `demoOtpController.js` (`demoOtpStore`, L46) | Unlimited guesses in a 5-minute window; OTPs visible in Render logs. | Hash OTP, store in Firestore with `attempts`, lock after 3, remove logging. | S |
| SEC-08 | High | **OTP verification not bound to registration.** `verifyEmailOtp` / `verifyPhoneOtp` return `{success:true}` and delete the code; `register()` never checks that verification occurred. | `signupOtpController.js` → `verifyEmailOtp`; `authController.js` → `register()` | Client can skip OTP entirely and call `/api/register` directly. | Have verify return a 10-minute signed token; require and validate it in `register`. | S |
| SEC-09 | High | **Firestore security rules not in version control.** No `firestore.rules` / `firebase.json`; live rules unknown, possibly test mode. | repo root | If rules are permissive, the DB is writable with just the public project ID. | Verify in console immediately; commit deny-all rules (all access is via Admin SDK). | S |
| SEC-10 | High | **JWT in `localStorage`, 7-day life, no revocation.** | `Login.jsx:38`; `authMiddleware.js`; `authController.js` → `generateToken()` | Any XSS exfiltrates a week-long admin session; no logout-everywhere. | httpOnly/Secure/SameSite cookie, 1h access + refresh token, server-side revocation list. | M |
| SEC-11 | High | **Wildcard CORS.** `app.use(cors())`. | `backend/index.js:22` | Any origin can call the API with the user's browser. | `cors({ origin: ["https://www.mythrealitytech.com"], credentials: true })`. | S |
| SEC-12 | High | **No HTTP security headers.** `helmet` not installed; no CSP, HSTS, X-Frame-Options. | `backend/index.js` | Clickjacking, MIME sniffing, weaker XSS containment. | `app.use(helmet())` with a CSP allowing `tile.openstreetmap.org`, `photon.komoot.io`, Google Fonts. | S |
| SEC-13 | Medium | **No input validation or output escaping.** Controllers only check field presence. User strings (`name`, `message`, `shippingAddress.*`, item names) are interpolated raw into HTML emails. | `enquiryController.js` → `sendEnquiry`; `orderController.js` email templates; `updateOrderStatus` | HTML injection into admin/customer emails; malformed data persisted. | Add `zod` schemas per route; HTML-escape every interpolated value. | M |
| SEC-14 | Medium | **Login user enumeration.** Distinct `"User not found"` vs `"Invalid password"` responses. | `authController.js` → `login()` | Confirms which emails/phones have accounts. | Single generic 401. | S |
| SEC-15 | Medium | **Vulnerable dependency.** `xlsx@^0.18.5` — prototype pollution + ReDoS advisories, no fix on npm registry. | `frontend/package.json`; used in `AdminDashboard.jsx` | Malicious spreadsheet opened in admin could exploit. | Use the SheetJS CDN build (≥ 0.20) or migrate to `exceljs`. | S |
| SEC-16 | Medium | **Upload type check is spoofable.** Extension + client-supplied `mimetype` only. | `middleware/uploadMiddleware.js` → `fileFilter` | Non-image payloads can be stored and served from `/uploads`. | Verify magic bytes with `file-type` after upload. | S |
| SEC-17 | Medium | **500 responses leak internal error messages.** `message: error.message` returned on every catch. | All controllers; `index.js` setup-admin | Leaks Firestore/gRPC internals, file paths. | Central error middleware; generic message in production, details to logs only. | S |
| SEC-18 | Medium | **Admin JWT payload trusts a `null` `adminId`.** Admins created via `setup-admin` land in `users`, so `adminDocId` is `null` and `companyId` is `null`; `requireAdmin` only verifies the signature. | `authController.js` → `login()`; `authMiddleware.js` | Company scoping (`order.companyId !== companyId`) behaves unpredictably for such tokens. | Fix SEC-02; validate required claims in `requireAdmin`. | S |
| SEC-19 | Low | **Hardcoded phone number in admin bootstrap.** `phone: "6874534901"`. | `backend/index.js:66` | Cosmetic once SEC-02 is removed. | Remove with the route. | S |
| SEC-20 | Low | **Secrets on developer disk with no rotation policy.** `backend/.env` holds Fast2SMS, Brevo, Shiprocket, JWT secrets in plaintext (correctly gitignored). | `backend/.env` | Laptop compromise = full credential set. | Rotate all after SEC-01 cleanup; add `.env.example`; document rotation cadence. | S |

---

## 2. Bugs (functional defects in live code)

| ID | Severity | Issue | Affected file / function | Impact | Suggested fix | Effort |
|---|---|---|---|---|---|---|
| BUG-01 | **Critical** | **Firestore credential failure was invisible.** `admin.initializeApp()` never contacts Google, so a revoked key only surfaced on the first query as a 500. `Purchase.jsx` did `if (data.success) setProducts(...)` and otherwise rendered "No products found / 0". This caused a live outage on 17 Sep 2026 (every DB route returned `16 UNAUTHENTICATED`). | `config/firebase.js`; `Purchase.jsx` → `fetchProducts` | Storefront, login, orders and admin all silently broken; appeared as an empty catalogue. | **RESOLVED (`fc9eed9`):** startup probe + `/api/health` (503 on failure) + explicit loading/error/retry UI. Remaining: set `FIREBASE_SERVICE_ACCOUNT` on Render with the new key and redeploy. | — |
| BUG-02 | High | **Email links point to localhost in production.** `FRONTEND_URL` is not defined in `.env` (0 occurrences); code falls back to `"http://localhost:3000"`. Every "Track Your Order" button in status-update emails is a dead link unless Render defines the variable. | `orderController.js:1414` (`FRONTEND_URL`); `updateOrderStatus` email template | Customers cannot reach tracking from emails. | Set `FRONTEND_URL=https://www.mythrealitytech.com` on Render and in `.env.example`; fail loudly in production if unset. | S |
| BUG-03 | High | **Product images are deleted on every deploy.** Multer writes to `backend/uploads/`; Render's filesystem is ephemeral. The 152 images currently surviving do so only because `backend/uploads/` is committed to Git — new uploads via the admin panel vanish on the next deploy. | `middleware/uploadMiddleware.js`; `productController.js` → `addProduct`/`updateProduct`; `fixImageUrls.js` (a repair script that exists because of this) | Admin-uploaded images break silently after each push. | Move to Firebase Storage / S3 / Cloudinary; store absolute URLs; stop tracking `backend/uploads/`. | M |
| BUG-04 | High | **Shipments can silently fail to be created.** `createShiprocketOrder()` swallows all errors and returns `null`; no flag, retry or alert. (Also see INT-01 — the business does not use Shiprocket at all.) | `orderController.js` → `createShiprocketOrder`, `createOrder` | Orders exist with no shipment and no one is told. | Either remove the integration (INT-01) or persist `shipmentStatus: "failed"` + admin retry + alert. | S–M |
| BUG-05 | High | **Multi-vendor order emails and stats can misattribute.** `createOrder` splits by `companyId` but the customer email loop and `totalAmount` in the response use per-group values while `OrderConfirmation.jsx` receives the whole-cart `total` from the client — the two can diverge (e.g. rounding of `groupShipping`/`groupTax` via `Math.round` on ratios). | `orderController.js` → `createOrder` ~L1550-1560; `Checkout.jsx` navigate state | Sum of sub-order totals ≠ displayed total by up to ±1 per group. | Compute all totals server-side once, return them, and have the confirmation page render the server response. | S |
| BUG-06 | Medium | **Inventory never decremented.** `stock` is stored on products but `createOrder` never reads or reduces it; there is no out-of-stock guard. | `orderController.js` → `createOrder`; `productController.js` | Overselling; `stock` shown to admins is fiction. | Firestore transaction: read stock, reject if insufficient, decrement, write order. | M |
| BUG-07 | Medium | **`geocodeRoutes.js` is dead but still mounted.** Both `/api/geocode/search` and `/reverse` proxy Nominatim; the frontend now calls Photon directly and the calls to these routes are commented out. The `User-Agent` still says `contact: your-email@example.com`, which violates Nominatim's usage policy if ever reactivated. | `routes/geocodeRoutes.js`; `LocationMap.jsx:43,72` (commented) | Unused attack surface; policy violation if used. | Remove the route file and its mount in `index.js`, or fix the UA and re-route the frontend through it (preferred for rate-limit control). | S |
| BUG-08 | Medium | **Catch-all `*` route masks API 404s.** Any unknown `/api/...` path returns `index.html` with HTTP 200. | `backend/index.js` (`app.get("*")`) | Typos in fetch URLs return HTML that fails JSON parsing with a confusing error; health checks against wrong paths pass falsely. | Add `app.all("/api/*", (req,res)=>res.status(404).json(...))` before the catch-all. | S |
| BUG-09 | Medium | **In-memory OTP and token caches break on restart / scale-out.** `otpStore`, `demoOtpStore`, `shiprocketToken` are module-level objects. | `signupOtpController.js`, `demoOtpController.js`, `orderController.js` | Any deploy or crash between "send" and "verify" invalidates all pending OTPs; a second instance cannot verify OTPs issued by the first. | Persist to Firestore (or Redis) with TTL. | S |
| BUG-10 | Low | **`getEstimatedDelivery()` uses server local time and hardcodes 3–5 days** regardless of pincode or day of week. | `utils/helpers.js` | Misleading delivery promise. | Compute from serviceability data or make it configurable per company. | S |

---

## 3. Missing features (expected for a production commerce platform)

| ID | Severity | Gap | Where it would live | Impact | Suggested fix | Effort |
|---|---|---|---|---|---|---|
| FEAT-01 | High | **No payment gateway.** Static/dynamic UPI QR only; no capture confirmation, no refunds, no reconciliation. | `Checkout.jsx`, `orderController.js` | Manual bank-statement matching; SEC-04 is a direct consequence. | Integrate Razorpay or Cashfree (UPI intent, cards, netbanking) with webhook-driven `paymentStatus`. | L |
| FEAT-02 | High | **No password reset.** No forgot-password route or UI. | `authRoutes.js`, `Login.jsx` | Locked-out customers/admins need manual DB edits. | Reuse OTP infra: request → OTP → set new password. | M |
| FEAT-03 | High | **No cancellation / return / refund flow.** Policy pages exist (`legal/CancellationPolicy.jsx`, `RefundPolicy.jsx`) but no code path. `cancelled` status exists only as a string admins can set. | `orderController.js`, `CustomerDashboard.jsx` | Policy promises the site cannot honour. | Customer-initiated cancel while `pending`; admin refund state; stock restore. | L |
| FEAT-04 | Medium | **No inventory management UI beyond a number.** No low-stock alerts, no stock history. | `AdminDashboard.jsx` | See BUG-06. | After BUG-06, add low-stock threshold + alert email. | M |
| FEAT-05 | Medium | **No admin audit log.** Product/order mutations are not attributed. | `productController.js`, `orderController.js` → `updateOrderStatus` | Cannot answer "who changed this order". | Append `{adminId, action, target, before, after, at}` to an `audit` collection. | S |
| FEAT-06 | Medium | **No order search / filter / pagination in admin.** `getAdminOrders` returns the entire collection. | `orderController.js` → `getAdminOrders`; `AdminDashboard.jsx` | Unusable past a few hundred orders. | Cursor pagination (`startAfter`) + status/date filters. | M |
| FEAT-07 | Medium | **No customer account self-service.** Customers cannot edit profile, saved addresses or delete their account. | `CustomerDashboard.jsx` | DPDP erasure requests must be handled manually. | Profile edit + "delete my account" with a soft-delete + purge job. | M |
| FEAT-08 | Medium | **No serviceability / shipping-cost calculation.** `shipping` comes from the client. | `Checkout.jsx`, `createOrder` | Wrong shipping charged; unserviceable pincodes accepted. | Server-side shipping table by pincode zone (or courier API if one is adopted). | M |
| FEAT-09 | Medium | **No email verification state on accounts.** `register` stores nothing about whether email/phone were verified. | `authController.js` → `register()` | Cannot distinguish verified customers. | Store `emailVerifiedAt` / `phoneVerifiedAt` when SEC-08 is fixed. | S |
| FEAT-10 | Low | **No order notes / invoice generation.** No PDF invoice, no GST fields. | — | Manual invoicing. | Generate invoice PDF on `delivered`. | M |
| FEAT-11 | Low | **No wishlist / saved cart.** `CartContext` is deliberately non-persistent (`// Empty cart by default - no localStorage`). | `context/CartContext.jsx` | Cart lost on refresh. | Persist cart in `localStorage` (guarded) or on the user record. | S |

---

## 4. Performance & scalability

| ID | Severity | Issue | Affected file / function | Impact | Suggested fix | Effort |
|---|---|---|---|---|---|---|
| PERF-01 | High | **Single instance, likely free/low tier.** One Render service serves API + static + uploads. Free tier sleeps after ~15 min → 30–60 s cold start. | Render config (no `render.yaml`) | First visitor after idle waits up to a minute; no redundancy. | Starter+ plan, ≥2 instances, health check on `/api/health`. | S |
| PERF-02 | Medium | **N+1 sequential Firestore reads at checkout.** One `doc(id).get()` per cart item in a `for` loop, then one `orders.add()` + one `admin` query + two emails **per company group**, all awaited serially. | `orderController.js` → `createOrder` | Checkout latency scales linearly with cart size; Shiprocket call adds 1–2 s more. | `db.getAll(...refs)` for products; `Promise.all` for per-group work; move email + shipment to fire-and-forget after responding. | S |
| PERF-03 | Medium | **`login()` performs up to four sequential queries** (`users` by email, `users` by phone, `admin` by email, `admin` by phone). | `authController.js` → `login()` | 4 round-trips on the miss path. | Normalise identifier; single `where("email"==)` + single `where("phone"==)` in parallel; or store a `loginKey` field. | S |
| PERF-04 | Medium | **No composite indexes in VCS; `getAdminOrders` filters by `companyId` and orders by `createdAt`.** Works only because Firestore auto-created the index in console, or will fail with `FAILED_PRECONDITION` when the query shape changes. | `orderController.js` → `getAdminOrders`, `getOrdersByCustomer`; missing `firestore.indexes.json` | Silent breakage on new query shapes. | Export and commit `firestore.indexes.json`; deploy via Firebase CLI. | S |
| PERF-05 | Medium | **No caching or cache headers on public reads.** `/api/products` hits Firestore on every page view; `express.static` uses default (no) `maxAge`. | `productController.js` → `getAllProducts`; `index.js` static mounts | Unnecessary Firestore reads (billed) and slow repeat visits. | `Cache-Control: public, max-age=60` on `/api/products`; `maxAge: "1y"` + hashed filenames for `/static`; short TTL in-memory cache. | S |
| PERF-06 | Medium | **No CDN; unoptimised images.** Hero/background JPEG/PNGs and all 152 product images served from the Express dyno. | `frontend/public/*.jpg/png`, `backend/uploads/` | Slow LCP on mobile; bandwidth on the single instance. | Cloudflare in front; convert to WebP/AVIF; responsive `srcset`. | M |
| PERF-07 | Medium | **No code splitting.** Zero `React.lazy`/`Suspense`. `leaflet`, `react-leaflet`, `framer-motion`, `xlsx` (admin-only) all in the 325 KB gzipped entry bundle. | `App.js` | Every visitor downloads the admin dashboard and spreadsheet library. | Route-level `React.lazy`; load `xlsx` only inside the export handler. | M |
| PERF-08 | Medium | **`getCustomerStats` / `getRecentOrders` load full order docs to compute counts.** | `orderController.js` | Grows with customer history; billed per document read. | Use `count()` aggregation queries; limit fields. | S |
| PERF-09 | Low | **Deprecated toolchain.** `react-scripts@5.0.1` (CRA, unmaintained); `caniuse-lite` 7 months stale. | `frontend/package.json` | Slow builds, stale transitive deps, no upstream security fixes. | Migrate to Vite; run `npx update-browserslist-db@latest`. | M |
| PERF-10 | Low | **No load testing; capacity unknown.** | — | Cannot plan for campaigns/launches. | k6 smoke test against staging once it exists. | S |

---

## 5. Dead / unused code and dependencies

| ID | Severity | Issue | Affected file(s) | Impact | Suggested fix | Effort |
|---|---|---|---|---|---|---|
| DEAD-01 | Medium | **53% of the source tree is commented-out code.** 11,576 of 21,685 lines across `backend/` and `frontend/src/` are `//` lines — entire previous versions of files retained above the live version. Worst offenders: `Purchase.jsx` 70% (2,116 lines), `Checkout.jsx` 68% (1,849), `AdminDashboard.jsx` 63% (2,364), `orderController.js` 62% (1,225), `productController.js` 65% (657), `Team.jsx` 73%, `AboutUs.jsx` 76%, `App.js` 59%. | 25 files ≥ 30% commented | Reviewers cannot find live code; grep returns 3–4 hits per symbol; merge conflicts; onboarding cost. | Delete all commented-out blocks — Git history preserves them. Add an ESLint rule / pre-commit check to block re-introduction. | S |
| DEAD-02 | Medium | **Compiled build committed.** 178 files under `frontend/build/` are tracked. | `frontend/build/**` | Stale bundle can be deployed; noisy diffs; repo bloat. | `git rm -r --cached frontend/build`; add to `.gitignore`; build in CI/Render only. | S |
| DEAD-03 | Medium | **`geocodeRoutes.js` unused** (see BUG-07). | `backend/routes/geocodeRoutes.js`, mount in `index.js` | Attack surface, confusion. | Remove or re-adopt. | S |
| DEAD-04 | Medium | **Shiprocket integration is unused by the business** (see INT-01). ~140 live lines + 2 env vars + a route. | `orderController.js:1413-1492, 1584-1601, 1803-1838`; `orderRoutes.js:65,77`; `.env` | Live credentials for an unused service; latency on checkout. | Remove per INT-01. | S |
| DEAD-05 | Low | **Unused npm dependencies (frontend).** `lucide-react` (0 live imports), `web-vitals` (0 live imports; `reportWebVitals.js` is commented out of `index.js`). | `frontend/package.json` | Install time, audit noise. | `npm uninstall lucide-react web-vitals`. | S |
| DEAD-06 | Low | **Unused npm dependency (backend).** `nodemailer` — email goes through Brevo's HTTP API; 0 live imports. | `backend/package.json` | Same. | `npm uninstall nodemailer`. | S |
| DEAD-07 | Low | **Root `package.json` declares `leaflet` and `react-leaflet`** — duplicates of the frontend's own deps; nothing at root imports them. | `/package.json` | Confusing; installs unused copies. | Remove from root `dependencies`. | S |
| DEAD-08 | Low | **Unused environment variables.** `ADMIN_PASS`, `FAST2SMS_TEMPLATE_ID`, `FAST2SMS_ENTITY_ID`, `FAST2SMS_SENDER_ID` have 0 live references (leftovers from the pre–Smart-OTP flow). | `backend/.env` | Secrets kept for no reason. | Remove from `.env`, Render, and any docs. | S |
| DEAD-09 | Low | **`fixImageUrls.js` maintenance script in the app root.** One-off repair tool for BUG-03, importable by the server bundle. | `backend/fixImageUrls.js` | Confusing; should not ship. | Move to `backend/scripts/` or delete after BUG-03 is fixed properly. | S |
| DEAD-10 | Low | **Template placeholder content.** `frontend/public/docs/gcare-journey.pptx.pptx` (double extension); Team page shipped 5 template placeholder people with non-existent images (removed 17 Sep, `5efe91d`). | `frontend/public/docs/`, `Team.jsx` | Unprofessional artefacts. | Rename the file; audit other pages for lorem-ipsum-style leftovers. | S |

---

## 6. Integrations

| ID | Severity | Issue | Affected file / function | Impact | Suggested fix | Effort |
|---|---|---|---|---|---|---|
| INT-01 | High | **Shiprocket creates a shadow order on every checkout, but fulfilment is entirely manual.** `createShiprocketOrder()` runs unconditionally per sub-order. Live data: 30 of 56 orders carry a `shiprocketOrderId`; **0** have an `awbCode` (no courier ever assigned). `trackShipment()` is mounted but called by nothing. | `orderController.js` → `createOrder`, `createShiprocketOrder`, `getShiprocketToken`, `trackShipment`; `orderRoutes.js:77`; `.env` `SHIPROCKET_EMAIL/PASSWORD` | 30 orphan orders accumulating in the Shiprocket panel; +1–2 s checkout latency; live third-party credentials for an unused service. Removal has **no** effect on order saving, admin status updates, tracking, emails or the manual workflow (verified: none of those read Shiprocket fields). | Remove the three functions, the route, the two env vars (local + Render), and the `docRef.update` of `shiprocketOrderId/shipmentId/awbCode`. Cancel the 30 orphan orders in Shiprocket. | S |
| INT-02 | High | **Fast2SMS is a single point of failure with no fallback and no cost cap.** Every signup and demo request sends a billable SMS; failures return 500 with the provider's message verbatim. | `signupOtpController.js` → `sendPhoneOtp`; `demoOtpController.js` → `sendDemoSmsOtp` | Provider outage blocks all signups; abuse drains credit (see SEC-06). | Rate-limit; add daily SMS budget alarm; surface a friendly error; consider email-only fallback. | S |
| INT-03 | Medium | **Brevo email failures are swallowed.** `sendMail` errors in `createOrder` and `updateOrderStatus` are caught and logged only. | `config/email.js`; `orderController.js` | Customers silently miss confirmations; no retry. | Queue with retry (Firestore `outbox` collection + scheduled sender) or at minimum flag `emailStatus` on the order. | M |
| INT-04 | Medium | **Map geocoding depends on Photon (komoot) public API called directly from the browser.** No key, no SLA, rate-limited per IP, and their fair-use policy discourages production use. `LocationMap.jsx:251,282`. | `frontend/src/pages/LocationMap.jsx` | Address search may throttle or disappear without notice. | Proxy through the backend (fixing BUG-07's UA) with caching, or move to a keyed provider (Mapbox/Google Places) with a budget. | M |
| INT-05 | Low | **OpenStreetMap tile server used directly for production traffic.** `tile.openstreetmap.org` usage policy prohibits heavy commercial use. | `LocationMap.jsx:370` | Tiles may be blocked. | Use a tile provider with terms for commercial use (MapTiler, Stadia, Mapbox). | S |

---

## 7. Production readiness — DevOps, testing, observability

| ID | Severity | Issue | Affected area | Impact | Suggested fix | Effort |
|---|---|---|---|---|---|---|
| OPS-01 | High | **No CI pipeline; push to `main` deploys straight to production.** No `.github/workflows`, no branch protection. Commit messages are predominantly `update code` (×15+). | Repo / GitHub / Render | Unreviewed, untested code reaches customers in minutes. | GitHub Actions (lint + build + tests) as required checks; protect `main`; PR workflow. | S |
| OPS-02 | High | **No staging environment.** | Render | Every change is tested in production. | Second Render service on a `staging` branch with a separate Firebase project. | M |
| OPS-03 | High | **Zero automated tests.** Backend `"test": "echo \"Error: no test specified\" && exit 1"`; frontend has only CRA's default `App.test.js`. | `backend/package.json`, `frontend/src/App.test.js` | Regressions (e.g. SEC-03 pricing) cannot be caught. | Start with unit tests for `createOrder` totals, `login`, OTP verify; Playwright smoke test for checkout. | L |
| OPS-04 | High | **No error tracking.** `console.error` only. | Both tiers | Failures are discovered by customers (as BUG-01 was). | Sentry on frontend + backend with release tags. | S |
| OPS-05 | High | **No Firestore backups / PITR.** | Firebase project | A bad write or accidental delete is unrecoverable. | Enable point-in-time recovery; schedule daily exports to GCS with 30-day retention. | S |
| OPS-06 | High | **No uptime monitoring.** | — | Outages go unnoticed (BUG-01 persisted until reported). | UptimeRobot / Better Stack on `/` and `/api/health`, alerting to a staffed channel. | S |
| OPS-07 | Medium | **Health endpoint** — **RESOLVED (`fc9eed9`):** `/api/health` now probes Firestore and returns 503 on failure. Remaining: point Render's health check at it. | `backend/index.js` | — | Configure in Render. | S |
| OPS-08 | Medium | **No central Express error handler.** Multer/JSON-parse errors surface as HTML or leak details. | `backend/index.js` | Inconsistent error shapes; SEC-17. | `app.use((err, req, res, next) => ...)` last. | S |
| OPS-09 | Medium | **Unstructured, PII-leaking logs.** Emoji `console.log` with OTPs, full Fast2SMS responses, full request payloads. | All controllers | Cannot search/alert; secrets in Render log retention. | `pino` JSON logs with redaction; ship to a log store. | S |
| OPS-10 | Medium | **No infrastructure-as-code.** No `render.yaml`; env vars and health-check config exist only in the dashboard. | Repo root | Environment cannot be reproduced; drift undetectable (BUG-02 is an example). | Commit `render.yaml` with `envVars` (values as `sync: false`). | S |
| OPS-11 | Medium | **No `.env.example`, no startup validation of required env vars.** `JWT_SECRET` missing ⇒ `jwt.sign` throws at first login; `FRONTEND_URL` missing ⇒ localhost links (BUG-02). | `backend/index.js`, `.env` | Misconfiguration surfaces late and cryptically. | Validate required vars at boot (`envalid`/`zod`) and exit with a clear message. | S |
| OPS-12 | Medium | **Undefined rollback strategy; releases untagged.** | Git / Render | Rolling back means guessing which "update code" commit was good. | Tag deploys (`v1.x`), document "Redeploy previous" in Render, write a rollback runbook. | S |
| OPS-13 | Low | **`npm audit` never run; lockfiles include known-vulnerable packages** (SEC-15). | Both `package-lock.json` | — | Add `npm audit --audit-level=high` to CI. | S |
| OPS-14 | Low | **Line-ending inconsistency.** Git warns `LF will be replaced by CRLF` on every touched file; no `.gitattributes`. | Repo | Noisy diffs across OSes. | Add `.gitattributes` with `* text=auto eol=lf`. | S |
| OPS-15 | Low | **Word lock file committed.** `~$_Tech_Gap_Analysis_Report.docx` (162 bytes) was captured in `fc9eed9` by `git add .`; Office lock files embed the editing user's name and are pure noise. `MR_Tech_Gap_Analysis_Report.docx` was committed in the same commit. | Repo root | Junk in history; hints at absent pre-commit hygiene. | `git rm --cached '~$*'`; add `~$*` and `*.docx` (or a `docs/` convention) to `.gitignore`. | S |

---

## 8. UX, accessibility, SEO & compliance

| ID | Severity | Issue | Affected file(s) | Impact | Suggested fix | Effort |
|---|---|---|---|---|---|---|
| UX-01 | High | **No React error boundary.** Zero `ErrorBoundary`/`componentDidCatch`. | `App.js` | Any render exception blanks the entire site. | Boundary at router root with a friendly fallback, reporting to Sentry. | S |
| UX-02 | Medium | **60 `alert()` calls in live frontend code** for success, validation and error messaging (`Checkout.jsx`, `AdminDashboard.jsx`, `Login.jsx`, `Signup.jsx`, …). | 10+ page components | Blocking native dialogs; unstyled; unusable on mobile; blocks automated testing. | Replace with a toast/notification component (or inline form errors). | M |
| UX-03 | Medium | **Accessibility.** 13 of 46 `<img>` have `alt`; 23 `aria-*` attributes site-wide; icon-only buttons (cart, close) lack labels; no visible focus styles audit. | Most pages; `Navbar.jsx`, `Purchase.jsx` | WCAG 2.1 A failures; screen-reader users cannot shop. | `eslint-plugin-jsx-a11y`; fix alt/labels; run axe. | M |
| UX-04 | Medium | **SEO metadata is static and minimal.** One generic `<title>`/`<meta description>`; no Open Graph, Twitter card, or canonical; no per-route titles; SPA ships an empty `#root` so crawlers see no content. `robots.txt` and `sitemap.xml` exist and are correct. | `public/index.html`, `App.js` | Poor search snippets and social previews; marketing pages effectively invisible to non-JS crawlers. | `react-helmet-async` per route; pre-render marketing routes (`react-snap`) or migrate them to Next.js. | M–L |
| UX-05 | Medium | **Legal pages exist but are unverified.** `PrivacyPolicy`, `TermsConditions`, `RefundPolicy`, `CancellationPolicy` present; content not reviewed against India's **DPDP Act 2023**; no named grievance officer; sub-processors (Fast2SMS, Brevo, Shiprocket, Google) not disclosed. | `frontend/src/pages/legal/*` | Non-compliance exposure alongside SEC-05. | Legal review; add grievance officer, retention periods, processor list. | M |
| UX-06 | Medium | **No consent capture.** No consent checkbox at signup/demo request; no record of consent. | `Signup.jsx`, demo form | Cannot evidence lawful basis under DPDP. | Checkbox + timestamp stored on the user record. | S |
| UX-07 | Medium | **No data-subject request path.** Customers cannot export or delete their data. | — | DPDP right-to-erasure unmet. | See FEAT-07. | M |
| UX-08 | Low | **Client-side-only route guard is forgeable.** `ProtectedRoute` trusts `localStorage.user.userType`. Backend still enforces, so impact is cosmetic. | `pages/ProtectedRoute.jsx` | Admin UI shell visible to anyone who edits localStorage. | Validate token server-side on mount (`GET /api/me`). | S |

---

## 9. Documentation

| ID | Severity | Gap | Impact | Suggested fix | Effort |
|---|---|---|---|---|---|
| DOC-01 | High | **No disaster-recovery plan.** No RTO/RPO; with OPS-05 unaddressed the effective RPO is total loss. | Cannot recover from data loss or a compromised account. | Write and rehearse: restore Firestore from export, rotate all keys, redeploy, verify via `/api/health`. | M |
| DOC-02 | Medium | **Internal architecture doc is inaccurate** (Realtime DB vs Firestore; two services vs one; OTP providers). | Misleads new engineers and vendors. | Update to match the "Actual architecture" section above; add a diagram. | S |
| DOC-03 | Medium | **No API documentation.** ~26 endpoints across 7 route files, undocumented. | Frontend/backend contract lives only in code. | `openapi.yaml` + `swagger-ui-express` at `/api/docs` (auth-gated). | M |
| DOC-04 | Medium | **README is 33 lines**; no env var list, no local setup, no deploy notes. | Onboarding depends on tribal knowledge. | Rewrite README; add `.env.example`, `CONTRIBUTING.md`. | S |
| DOC-05 | Low | **No incident/on-call process or runbooks.** | Outage response is ad hoc. | One-page incident policy + runbooks for "DB auth failure", "SMS provider down", "rollback". | S |

---

## Prioritised remediation plan

### Immediately (this week) — all Small effort
1. **SEC-01** — purge the old key from Git history; confirm repo visibility; ensure the new key lives only in Render's `FIREBASE_SERVICE_ACCOUNT`.
2. **SEC-02** — delete `POST /api/setup-admin`; audit `users` for rogue admins.
3. **SEC-03 / SEC-04** — server-side pricing; stop auto-marking orders paid.
4. **SEC-05 / SEC-06 / SEC-07 / SEC-08** — customer auth on order routes; rate limiting; OTP attempt limits; bind OTP verification to registration.
5. **OPS-05 / OPS-06 / OPS-04** — Firestore PITR + exports; uptime monitor; Sentry.
6. **BUG-02** — set `FRONTEND_URL` on Render.
7. **OPS-15** — remove the committed Word lock file and stop tracking generated reports.

### Next (2–4 weeks)
- **INT-01** remove Shiprocket · **BUG-03** durable image storage · **SEC-09** commit Firestore rules · **SEC-10/11/12** cookie auth, CORS allowlist, Helmet · **OPS-01/02** CI + staging · **DEAD-01/02** delete commented code and the committed build · **OPS-11** env validation + `.env.example` · **UX-01** error boundary.

### Then (next quarter)
- **FEAT-01** payment gateway · **FEAT-02/03** password reset, cancellation/refund · **BUG-06** inventory transactions · **OPS-03** test suite · **PERF-06/07** CDN + code splitting · **UX-02/03/04** replace alerts, accessibility, SEO · **UX-05/06/07** DPDP compliance · **DOC-01/03** DR plan, API docs.

---

## Appendix A — Verified facts used in this analysis

| Fact | Evidence |
|---|---|
| Products collection | 57 documents; all have `name, category, price, stock, sku, image, description, createdAt, updatedAt`; none have `companyId` |
| Orders collection | 56 documents (Nov 2025 – Sep 2026); 30 with `shiprocketOrderId`; 0 with `awbCode`; statuses: pending 36, processing 8, delivered 6, shipped 3, confirmed 3 |
| Production API on 17 Sep 2026 | `GET /api/products` → HTTP 500 `16 UNAUTHENTICATED` (revoked key `a19bfb8b…`) |
| Old key in Git | Present since `7d3f474 initial commit`; `.gitignore` lines 4–5 were UTF-16 encoded and ineffective |
| Commented-out code | 11,576 / 21,685 source lines (53%) |
| Live `alert()` calls | 60 |
| Frontend bundle | 325.5 KB gzipped JS, 22.2 KB CSS (single chunk) |
| Team page images | 5 of 8 Social Entrepreneur cards referenced non-existent files (removed, `5efe91d`) |
| Env vars with zero live references | `ADMIN_PASS`, `FAST2SMS_TEMPLATE_ID`, `FAST2SMS_ENTITY_ID`, `FAST2SMS_SENDER_ID` |
| Frontend deps with zero live imports | `lucide-react`, `web-vitals` · Backend: `nodemailer` |

## Appendix B — Route inventory (live)

| Method | Path | Auth | Handler | Notes |
|---|---|---|---|---|
| POST | `/api/setup-admin` | **none** | inline in `index.js` | **SEC-02 — remove** |
| GET | `/api/health` | none | inline in `index.js` | added in `fc9eed9` |
| POST | `/api/register` | none | `authController.register` | SEC-08 |
| POST | `/api/login` | none | `authController.login` | SEC-14, PERF-03 |
| POST | `/api/admin/create-company-admin` | admin + super | `authController.createCompanyAdmin` | |
| GET | `/api/admin/companies` | admin + super | `authController.getCompanies` | |
| POST | `/api/send-otp` | none | `demoOtpController.sendDemoOtp` | SEC-06/07 |
| POST | `/api/verify-otp` | none | `demoOtpController.verifyDemoOtp` | |
| POST | `/api/signup/send-email-otp` | none | `signupOtpController.sendEmailOtp` | SEC-07 |
| POST | `/api/signup/verify-email-otp` | none | `signupOtpController.verifyEmailOtp` | SEC-08 |
| POST | `/api/signup/send-phone-otp` | none | `signupOtpController.sendPhoneOtp` | billable SMS |
| POST | `/api/signup/verify-phone-otp` | none | `signupOtpController.verifyPhoneOtp` | |
| POST | `/api/send-enquiry` | none | `enquiryController.sendEnquiry` | SEC-13 |
| GET | `/api/products` | none | `productController.getAllProducts` | PERF-05 |
| GET | `/api/products/:id` | none | `productController.getProductById` | |
| GET | `/api/admin/products` | admin | `productController.getAdminProducts` | |
| POST | `/api/products` | admin | `productController.addProduct` | BUG-03 |
| PUT | `/api/products/:id` | admin | `productController.updateProduct` | BUG-03 |
| DELETE | `/api/products/:id` | admin | `productController.deleteProduct` | |
| POST | `/api/orders` | none | `orderController.createOrder` | SEC-03/04, INT-01 |
| GET | `/api/orders/customer/:email` | **none** | `getOrdersByCustomer` | **SEC-05** |
| GET | `/api/orders/customer/:email/stats` | **none** | `getCustomerStats` | **SEC-05** |
| GET | `/api/orders/customer/:email/recent` | **none** | `getRecentOrders` | **SEC-05** |
| GET | `/api/orders/track/:orderId` | **none** | `trackOrder` | **SEC-05** |
| GET | `/api/orders/shiprocket-track/:orderId` | none | `trackShipment` | dead — INT-01 |
| GET | `/api/orders` | admin | `getAdminOrders` | FEAT-06 |
| PUT | `/api/orders/:orderId` | admin | `updateOrderStatus` | |
| GET | `/api/geocode/search` | none | inline | dead — BUG-07 |
| GET | `/api/geocode/reverse` | none | inline | dead — BUG-07 |
| GET | `*` | none | serves `index.html` | BUG-08 |
