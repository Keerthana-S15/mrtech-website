# MRTech — API Reference

Every endpoint the backend exposes, read from the route and controller files.
Request fields, response shapes and status codes are taken from the code, not
from convention. Where an endpoint behaves in a way that is likely to surprise a
caller, that is called out inline.

**Base path:** all routers are mounted at `/api` (`backend/index.js`, lines 63–70).
**Origin:** the API is served by the same Express process and port as the site,
so the frontend calls it with relative paths (`/api/...`).

**35 endpoints across 8 routers.** 11 require authentication.

---

## Contents

1. [Authentication](#1-authentication)
2. [Conventions](#2-conventions)
3. [Auth & accounts](#3-auth--accounts) — 4
4. [Orders](#4-orders) — 11
5. [Products](#5-products) — 7
6. [Signup OTP](#6-signup-otp) — 4
7. [Password reset](#7-password-reset) — 3
8. [Demo request OTP](#8-demo-request-otp) — 2
9. [Enquiries](#9-enquiries) — 1
10. [Geocoding](#10-geocoding) — 3
11. [Health](#11-health)
12. [Known gaps](#12-known-gaps)

---

## 1. Authentication

Protected endpoints expect a JWT in the `Authorization` header:

```
Authorization: Bearer <token>
```

The token comes from `POST /api/login`. It is signed with `JWT_SECRET` and
expires after **7 days** (`controllers/authController.js`).

Two middlewares guard routes (`middleware/authMiddleware.js`):

| Middleware | Requires | Failure |
|---|---|---|
| `requireAdmin` | A valid token | `401 {"success": false, "error": "No token provided"}` or `401 {"success": false, "error": "Invalid or expired token"}` |
| `requireSuperAdmin` | `isSuperAdmin: true` in the token | `403 {"success": false, "error": "Super admin access required"}` |

### Company scoping

Admin tokens carry a `companyId`. Non-super admins see and modify only their own
company's orders and products; a super admin sees everything. Attempts to reach
another company's record return `403 … "You do not have access to this order"`
(or `… product`).

---

## 2. Conventions

- **Content type:** `application/json`, except product create/update, which are
  `multipart/form-data`, and `GET /api/product-image/:id`, which returns an image.
- **Success:** most endpoints return `{"success": true, ...}` with HTTP 200.
- **Errors:** the shape is **not uniform.** Older endpoints return
  `{"error": "..."}`; newer ones return `{"success": false, "error": "..."}`.
  Both appear below exactly as the code sends them. A client should treat the
  HTTP status as authoritative and read `error` defensively.
- **Unhandled exceptions** become `500` with `"Internal Server Error"`.

---

## 3. Auth & accounts

`routes/authRoutes.js` → `controllers/authController.js`

### `POST /api/register`

Creates a customer. Admin accounts cannot be created here.

**Body:** `fullName`, `email`, `phone`, `password` — all required. `userType` is
accepted but forced to `customer`.

**200** `{"success": true, "message": "Customer registered successfully", "id": "<docId>"}`

| Status | Error |
|---|---|
| 400 | `All fields are required` |
| 400 | `User already exists` |
| 403 | `Admin accounts cannot be self-registered` — returned when `userType: "admin"` is sent |

Passwords are hashed with bcrypt (10 rounds) before storage.

### `POST /api/login`

**Body:** `emailOrPhone`, `password`.

**200**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "<jwt>",
  "user": {
    "fullName": "...", "email": "...", "phone": "...",
    "userType": "customer | admin",
    "companyId": null, "companyName": null,
    "isSuperAdmin": false
  }
}
```

| Status | Error |
|---|---|
| 400 | `Email and password are required` |
| 400 | `User not found` |
| 400 | `Invalid password` |
| 503 | Database unavailable — `Sign-in is temporarily unavailable: the database is not responding. Please try again.` |

> The 503 is deliberate: it separates "wrong credentials" from "Firestore is
> rejecting our key", which otherwise looks like a login failure to the user.

### `POST /api/admin/create-company-admin` 🔒 super admin

**Body:** `fullName`, `email`, `phone`, `password`, `companyId`, `companyName` —
all required.

**200** `{"success": true, "message": "Admin account created for <companyName>", ...}`

| Status | Error |
|---|---|
| 400 | `fullName, email, phone, password, companyId, and companyName are all required` |
| 400 | `An admin with this email already exists` |
| 400 | `This companyId is already in use` |

### `GET /api/admin/companies` 🔒 super admin

**200** `{"success": true, "companies": [...]}`

---

## 4. Orders

`routes/orderRoutes.js` → `controllers/orderController.js`, `controllers/deliveryOtpController.js`

### `POST /api/orders`

Places an order. **Public — no authentication.**

**Body:** `customerName`, `email`, `phone`, `items`, `shippingAddress`,
`paymentMethod`, `totalAmount` are required; `subtotal`, `shipping`, `tax` are
optional.

`shippingAddress` is stored **verbatim**, so any extra keys are persisted. The
checkout currently sends:

```json
{
  "fullName": "...", "address": "...", "city": "...",
  "state": "...", "pincode": "...", "phone": "...", "addressType": "Home",
  "lat": 11.740626, "lng": 78.963713,
  "mapAddress": "...", "locationSource": "map",
  "locationAccuracy": "exact | approximate"
}
```

`locationAccuracy: "approximate"` means the pin is the centre of a matched area
and the customer has not dragged it onto their door — worth a call before the
last mile.

**200** `{"success": true, "message": "Order placed successfully", "orderId": "ORD<timestamp>"}`

| Status | Error |
|---|---|
| 400 | `All fields are required` |
| 400 | `Product not found: <name>` |

**Multi-vendor splitting.** Each item's real `companyId` is looked up in
Firestore — the client is never trusted for it. Items are grouped by company and
written as **one order document per company**. With more than one company the
sub-orders are `ORD<ts>-<companyId>` and share a `parentOrderId`; with one
company the single order id is `ORD<ts>`. Shipping and tax are split by each
group's share of the subtotal.

A Shiprocket shipment is attempted per sub-order on a best-effort basis and never
blocks the order.

### `GET /api/orders/customer/:email`

**⚠️ No authentication — see [Known gaps](#12-known-gaps).**

**200** `{"success": true, "orders": [...], "count": n}`
Empty case: `{"success": true, "orders": [], "message": "No orders found for this customer"}`

### `GET /api/orders/customer/:email/stats`

**⚠️ No authentication.**

**200**

```json
{"success": true, "stats": {
  "totalOrders": 0, "totalSpent": 0, "activeOrders": 0,
  "deliveredOrders": 0, "pendingOrders": 0,
  "cancelledOrders": 0, "statusBreakdown": {}
}}
```

### `GET /api/orders/customer/:email/recent`

**⚠️ No authentication.** **Query:** `limit` (default `5`).

**200** `{"success": true, "orders": [...]}`

### `GET /api/orders/track/:orderId`

Public order tracking. Tries `orderId` first; if nothing matches it retries on
`parentOrderId`, so tracking a multi-vendor purchase returns **all** its
sub-orders together.

| Status | Error |
|---|---|
| 400 | `Order ID is required` |
| 404 | `Order not found` |

### `GET /api/orders/shiprocket-track/:orderId`

Live courier tracking via Shiprocket.

**200 (shipped)** `{"success": true, "shipped": true, "orderId": "...", "awbCode": "...", "tracking": {...}}`
**200 (not yet shipped)** `{"success": true, "shipped": false, "message": "Order has not been shipped yet, no live tracking available."}`

### `GET /api/orders` 🔒 admin

All orders for the caller's company; everything for a super admin. Sorted by
`createdAt` descending and served through a short-lived cache.

**200** `{"success": true, "orders": [...]}`

### `PUT /api/orders/:orderId` 🔒 admin

**Body:** `orderStatus` (required).

| Status | Error |
|---|---|
| 400 | `Order status is required` |
| 404 | `Order not found` |
| 403 | `You do not have access to this order` |
| **409** | COD orders cannot be set to `delivered` here — use the delivery-OTP flow |

> The 409 exists so a COD order cannot be marked delivered while its
> `paymentStatus` is still `pending`. Completing delivery through the OTP flow
> below sets both together.

### `POST /api/orders/:orderId/delivery-otp/send` 🔒 admin

Sends a one-time code to the customer to confirm handover.

| Status | Error |
|---|---|
| 400 | Order not in a state that allows delivery confirmation |
| 429 | `Please wait a few seconds before sending another code.` |
| 429 | `Too many codes sent for this order. Please try again later.` |

### `POST /api/orders/:orderId/delivery-otp/verify` 🔒 admin

Verifies the code and completes delivery.

### `DELETE /api/orders/:orderId` 🔒 admin

**Soft delete** — the document is copied to `deleted_orders` before removal.

**200** `{"success": true, "message": "Order <orderId> deleted"}`

| Status | Error |
|---|---|
| 404 | `Order not found` |
| 403 | `You do not have access to this order` |

---

## 5. Products

`routes/productRoutes.js` → `controllers/productController.js`, `controllers/productImageController.js`

### `GET /api/products`

Public catalogue. **200** `{"success": true, "products": [...], "count": n}`

### `GET /api/products/:id`

**200** `{"success": true, "product": {...}}` · **404** `Product not found`

### `GET /api/product-image/:id`

Returns the **image bytes**, not JSON. Images are stored base64 in the
`productImages` collection and decoded on the way out, with `Content-Type` taken
from the stored `contentType`.

### `GET /api/admin/products` 🔒 admin

Company-scoped. **200** `{"success": true, "products": [...], "count": n}`

### `POST /api/products` 🔒 admin

**`multipart/form-data`.** Fields: `name`, `category`, `price`, `sku` required;
`stock`, `description` optional; `companyId` honoured **only** for a super admin
(others are forced to their own). File field: `image`.

**200** `{"success": true, "message": "Product added successfully", ...}`

| Status | Error |
|---|---|
| 400 | `Name, category, price, and SKU are required` |
| 400 | `companyId is required` |
| **413** | Image too large — the cap is `MAX_IMAGE_BYTES` = **700 KB** raw |
| 400 | `Only image files are allowed!` — jpeg, jpg, png, gif, webp only |

> 700 KB is not arbitrary: base64 inflates it to ~934 KB, just under Firestore's
> 1 MiB per-document limit. A reverse proxy in front of this must allow a body of
> at least 1 MB (multipart overhead sits on top).

### `PUT /api/products/:id` 🔒 admin

Same field rules as create; all fields optional. A new `image` replaces the old
document in `productImages`.

**404** `Product not found` · **403** `You do not have access to this product` · **413** image too large

### `DELETE /api/products/:id` 🔒 admin

**200** `{"success": true, "message": "Product deleted successfully"}`
**404** / **403** as above.

---

## 6. Signup OTP

`routes/signupOtpRoutes.js` → `controllers/signupOtpController.js`

Email and phone are verified separately during signup.

### `POST /api/signup/send-email-otp`

**Body:** `email`. **200** `{"success": true, "message": "OTP sent to email"}`
**400** `Email is required` · **500** `Failed to send email OTP`

### `POST /api/signup/verify-email-otp`

**Body:** `email`, `otp`. **200** `{"success": true, "message": "Email verified successfully"}`

| Status | Error |
|---|---|
| 400 | `Email and OTP required` / `OTP not found. Request again.` / `OTP expired. Request again.` / `Invalid OTP. Try again.` |

### `POST /api/signup/send-phone-otp`

**Body:** `phone` — must be a valid 10-digit Indian mobile.

| Status | Error |
|---|---|
| 400 | Invalid number |
| 429 | Resend too soon, or too many sends |
| 503 | SMS provider not configured or unavailable |

> SMS goes out over the Fast2SMS **DLT** route, which is DND-exempt. The OTP is
> generated and verified by this server rather than by the provider's one-shot
> verify endpoint, so resends work.

### `POST /api/signup/verify-phone-otp`

**Body:** `phone`, `otp`. **400** `Phone and OTP required` / `Enter a valid 10-digit Indian mobile number.`

---

## 7. Password reset

`routes/passwordResetRoutes.js` → `controllers/passwordResetController.js`

Three steps: request a code, exchange it for a short-lived reset token, then set
the password. OTPs are stored SHA-256 hashed and compared with
`crypto.timingSafeEqual`.

| Limit | Value |
|---|---|
| OTP lifetime | 10 minutes |
| Reset-token lifetime | 10 minutes after a successful verify |
| Sends per identifier | 3 per 15 minutes |
| Minimum password length | 6 |

### `POST /api/forgot-password/request`

**Body:** `identifier` — email or 10-digit mobile.

**200** always returns the **same generic response** whether or not the account
exists. This is deliberate: it stops the endpoint being used to discover which
emails and numbers are registered.

| Status | Error |
|---|---|
| 400 | `Enter your registered email or phone number.` / `Enter a valid email address or 10-digit mobile number.` |
| 429 | Send limit reached |
| 502 | The email or SMS provider failed |

### `POST /api/forgot-password/verify`

**Body:** `identifier`, `otp` (6 digits).

**200** `{"success": true, "resetToken": "<token>", "expiresInMinutes": 10}`

| Status | Error |
|---|---|
| 400 | `Enter the code we sent you.` / `The code is 6 digits.` / `That code has expired. Request a new one.` |
| 429 | `Too many incorrect attempts. Request a new code.` — 5 attempts |

### `POST /api/forgot-password/reset`

**Body:** `resetToken`, `password`.

**200** `{"success": true, "message": "Password updated. You can sign in now."}`

| Status | Error |
|---|---|
| 400 | `Your reset session has expired. Start again.` / `Password must be at least 6 characters.` |

---

## 8. Demo request OTP

`routes/demoOtpRoutes.js` → `controllers/demoOtpController.js`

Verifies both email and mobile for a demo request before it is recorded in
`demoRequests`.

### `POST /api/send-otp`

**Body:** `email`, `mobile`.

**200** `{"success": true, "emailSent": true, "mobileSent": true, "message": "...", "warning": "..."}`
`warning` appears only when one channel failed but the other succeeded.

| Status | Error |
|---|---|
| 400 | `Email and Mobile are required` / `Enter a valid email address` / `Enter a valid 10-digit mobile number` |
| 429 | `Please wait <n>s before requesting a new OTP` |

### `POST /api/verify-otp`

**Body:** `name`, `email`, `mobile`, `emailOtp`, `mobileOtp`.

| Status | Error |
|---|---|
| 400 | `Email is required` / `Email OTP is required` / `Mobile OTP is required` / `Invalid Email OTP` |
| 400 | `OTP not found or expired. Please request a new one.` / `OTP expired. Please request a new one.` |
| 400 | `Mobile number does not match the one the OTP was sent to` |
| 429 | `Too many incorrect attempts. Please request a new OTP.` |

---

## 9. Enquiries

`routes/enquiryRoutes.js` → `controllers/enquiryController.js`

### `POST /api/send-enquiry`

Contact form. Writes to `enquiries` and emails `ADMIN_EMAIL`.

**Body:** `name`, `phone`, `email`, `service`, `message` — all required.

**200** `{"success": true, "id": "<docId>"}` · **400** `All fields are required`

---

## 10. Geocoding

`routes/geocodeRoutes.js`

A server-side proxy to Nominatim (OpenStreetMap). It exists because Nominatim's
usage policy forbids calling it directly from browsers and caps requests at one
per second **per source** — and every customer shares this server's IP.

The proxy enforces that centrally: one global queue with a 1.1 s minimum gap,
in-flight de-duplication (identical concurrent requests become one upstream
call), a 10-minute cache including empty results, and 429 handling with backoff
plus a 20-second cooldown.

> **These limits are per process.** Running the app under PM2 cluster mode would
> create one queue per worker and multiply the request rate. See
> `MRTECH_TECH_STACK.md` §11.

### `GET /api/geocode/search`

**Query:** `q` (min 3 characters) **or** `postalcode`.

Returns the raw Nominatim array (`format=json&addressdetails=1&limit=5&countrycodes=in`).
Under 3 characters returns `[]`.

### `GET /api/geocode/resolve`

**Query:** `q`.

Walks a ladder of progressively weaker queries — the address as typed, then
without a door number or bracketed landmark, then dropping the most specific
parts, then the PIN code alone — and returns the first rung that yields a
plausible result.

```json
{"trust": "exact | reduced | pin | none", "usedQuery": "...", "tried": ["..."], "results": [...]}
```

`trust` records how much of the address had to be given up. **Only `exact` may be
turned into a precise pin;** anything found by weakening the query is treated as
area-level by the client.

Results that name a different locality, or that sit in a different PIN sorting
district (first three digits), are filtered out and the ladder continues.

> The ladder exists because Nominatim's free-form search is **conjunctive** —
> one token OSM has never heard of makes the whole query return nothing, even
> for a perfectly valid address.

### `GET /api/geocode/reverse`

**Query:** `lat`, `lon` — both required. Coordinates are rounded to ~1 m before
becoming a cache key, so two taps on the same doorstep cost one upstream call.

**400** `lat and lon are required`

### Shared failure modes

| Status | Body |
|---|---|
| 429 | `{"error": "rate_limited", "retryAfter": <seconds>, "message": "Address lookup is busy. Try again in about <n> seconds, or tap your spot on the map."}` |
| 502 | `{"error": "Failed to search location"}` / `{"error": "Failed to get address"}` |

---

## 11. Health

### `GET /api/health`

Defined directly in `backend/index.js`. Re-probes Firestore on every call, so a
revoked service-account key shows up here rather than as an empty storefront.

**200** `{"status": "ok", "firestore": {...}, "uptimeSeconds": 1234}`
**503** `{"status": "degraded", "firestore": {...}, "uptimeSeconds": 1234}`

> Point an uptime monitor at this, not at `/`. A reverse-proxy or container
> liveness check should use `/` instead — Firestore being unreachable is a real
> signal but not a reason to restart a healthy web server.

---

## 12. Known gaps

Facts about the current code, not suggestions for this document.

**Customer order endpoints are unauthenticated.** `GET /api/orders/customer/:email`
and its `/stats` and `/recent` variants take an email in the path and return that
customer's order history — including delivery address and map coordinates — to
anyone who can guess an address. Nothing checks who is asking.

**Non-COD orders are recorded as paid without verification.**
`paymentStatus: paymentMethod === "COD" ? "pending" : "paid"`. There is no
payment gateway in the repository, so a UPI or card order is marked paid on the
customer's word.

**CORS is fully open.** `app.use(cors())` with no options. The frontend is
same-origin, so this permits more than anything needs.

**Error shapes are inconsistent.** `{"error": ...}` in older endpoints,
`{"success": false, "error": ...}` in newer ones. Clients should branch on the
HTTP status.

**OTP and rate-limit state is in memory.** Signup OTPs, password-reset codes,
send counters and the geocode throttle all live in process memory. A restart
clears them, and multiple processes do not share them.

---

*Generated from the repository. No code was modified and no secrets are included.*
