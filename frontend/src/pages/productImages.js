/**
 * Shared product-image resolution.
 *
 * This used to live inside Purchase.jsx, which meant the shop resolved images
 * correctly while Checkout read `item.image` straight off the cart entry — so
 * the same product showed a picture on one page and a broken icon on the next.
 * Both pages now go through here.
 *
 * Background: product photos uploaded through the admin panel are written to
 * the server's /uploads folder, and Render's disk is ephemeral — anything
 * uploaded there is wiped on the next deploy. The affected products are served
 * from the repo instead so they survive.
 */

/** Keyed by product name, trimmed and lowercased. */
export const LOCAL_PRODUCT_IMAGES = {
  "urine container": "/images/products/urine-container.jpg",
  // exact match only, so "Syringe Destroyer" keeps its own image
  syringe: "/images/products/syringe.jpg",
};

/**
 * Best image URL for a product or cart line, or undefined when there is none.
 *
 * Cart entries carry their options in the name ("syringe - 3ml / green"), so
 * the lookup retries on the part before the options suffix.
 */
export const resolveProductImage = (product) => {
  const name = product?.name?.trim().toLowerCase();
  if (!name) return product?.image;
  return (
    LOCAL_PRODUCT_IMAGES[name] ||
    LOCAL_PRODUCT_IMAGES[name.split(" - ")[0].trim()] ||
    product?.image
  );
};
