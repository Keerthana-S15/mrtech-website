/**
 * A tiny in-process cache for read-heavy Firestore queries.
 *
 * Why this exists
 * ---------------
 * Firestore bills per document read. The admin dashboard re-polls orders and
 * products every 30 seconds, and the storefront reads the whole product
 * catalogue on every visit. With ~62 products that is ~68 document reads every
 * 30 seconds per open dashboard — about 8,000 an hour, which exhausts the
 * 50,000/day free tier in roughly six hours from a single tab left open, before
 * any customer traffic. That is what produced
 * "8 RESOURCE_EXHAUSTED: Quota exceeded".
 *
 * What it changes
 * ---------------
 * Nothing about the data. Identical reads inside a short window are answered
 * from memory, and every write path invalidates the keys it affects, so a
 * change is visible on the next request rather than after a timeout. Several
 * dashboards and every storefront visitor now share one underlying read
 * instead of each paying for their own.
 *
 * Deliberately in-process: Render runs a single instance, there is no Redis,
 * and adding one would be a bigger change than the problem needs. If the app is
 * ever scaled to multiple instances each will keep its own copy, which is still
 * correct — entries expire and writes invalidate — just less effective.
 */

const store = new Map(); // key -> { value, expiresAt }

/** Counters so the effect can be measured rather than assumed. */
export const cacheStats = { hits: 0, misses: 0, invalidations: 0 };

/**
 * Returns the cached value for `key`, or runs `loader` and caches it.
 * A loader that throws is never cached.
 */
export async function cached(key, ttlMs, loader) {
  const now = Date.now();
  const hit = store.get(key);

  if (hit && hit.expiresAt > now) {
    cacheStats.hits += 1;
    return hit.value;
  }

  cacheStats.misses += 1;
  const value = await loader();
  store.set(key, { value, expiresAt: now + ttlMs });
  return value;
}

/** Drops every key beginning with `prefix`. Called from the write paths. */
export function invalidate(prefix) {
  let dropped = 0;
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) {
      store.delete(key);
      dropped += 1;
    }
  }
  if (dropped) cacheStats.invalidations += dropped;
  return dropped;
}

/** Test helper: empties everything. */
export function clearCache() {
  store.clear();
  cacheStats.hits = 0;
  cacheStats.misses = 0;
  cacheStats.invalidations = 0;
}

export const CACHE_KEYS = {
  publicProducts: "products:public",
  adminProducts: (companyId, isSuper) => `products:admin:${isSuper ? "*" : companyId}`,
  adminOrders: (companyId, isSuper) => `orders:admin:${isSuper ? "*" : companyId}`,
};

/**
 * These can be generous because every mutation invalidates its own keys, so a
 * change made through the API is visible on the very next request rather than
 * after the window closes. The TTL only bounds how stale a value can get while
 * nothing has changed.
 *
 * Products are the expensive read (the whole catalogue) and only an admin edit
 * changes them — placing an order does not touch stock — so they are held for
 * minutes. Orders are far cheaper and are held for one poll interval, which is
 * what lets several open dashboards share a single read.
 *
 * The one case these do not cover is an edit made directly in the Firestore
 * console, which cannot invalidate anything; that appears within the TTL.
 */
export const TTL = {
  products: 300_000,  // 5 minutes
  orders: 30_000,     // one dashboard poll interval
};
