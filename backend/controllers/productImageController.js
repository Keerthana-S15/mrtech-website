import { db } from "../config/firebase.js";

// ---------------------------------------------------------------------------
// Durable storage for product photos.
//
// Uploads used to be written to the server's own /uploads folder. That works
// locally — the file is written exactly where Express serves it from — but
// Render's filesystem is ephemeral: anything written at runtime is gone the
// next time the instance restarts or redeploys. The product kept its
// /uploads/<file> path in Firestore while the file behind it no longer
// existed, so the image 404'd and the page showed a broken thumbnail.
//
// The bytes now live in Firestore alongside everything else that has to
// survive, in their own `productImages` collection rather than on the product
// document. Keeping them separate matters: the storefront lists every product
// in one request, and inlining base64 there would turn a small JSON payload
// into megabytes. Products instead carry a URL pointing at serveProductImage,
// which the browser fetches per image and can cache for a year — the id is
// unique per upload, so a replaced photo gets a new URL rather than a stale
// cached one.
//
// Firestore caps a document at 1 MiB, so an upload has to stay well under that
// once base64-encoded (encoding adds a third). The admin form downscales
// before uploading; MAX_IMAGE_BYTES is the backstop for anything that slips
// past, and it fails with a message that says what to do.
//
// Images already stored as /uploads/... still work: those 152 files are
// committed to the repository, and index.js still serves that folder.
// ---------------------------------------------------------------------------

export const IMAGE_COLLECTION = "productImages";

/** Raw bytes. 700 KB becomes ~934 KB base64, leaving room under the 1 MiB cap. */
export const MAX_IMAGE_BYTES = 700 * 1024;

/**
 * Stores an uploaded file and returns the URL to save on the product.
 * Throws with a readable message when the file is too large to store.
 */
export async function storeProductImage(file, { companyId } = {}) {
  if (!file?.buffer) return "";

  if (file.buffer.length > MAX_IMAGE_BYTES) {
    const err = new Error(
      `Image is ${(file.buffer.length / 1024).toFixed(0)} KB. Please upload one under ${
        MAX_IMAGE_BYTES / 1024
      } KB.`
    );
    err.code = "IMAGE_TOO_LARGE";
    throw err;
  }

  const ref = await db.collection(IMAGE_COLLECTION).add({
    data: file.buffer.toString("base64"),
    contentType: file.mimetype || "application/octet-stream",
    bytes: file.buffer.length,
    originalName: file.originalname || null,
    companyId: companyId || null,
    createdAt: new Date().toISOString(),
  });

  return `/api/product-image/${ref.id}`;
}

/** Best effort: an orphaned image row is harmless, a failed delete is not. */
export async function deleteProductImage(imageUrl) {
  const id = typeof imageUrl === "string" && imageUrl.startsWith("/api/product-image/")
    ? imageUrl.slice("/api/product-image/".length)
    : null;
  if (!id) return;
  try {
    await db.collection(IMAGE_COLLECTION).doc(id).delete();
  } catch (err) {
    console.error(`🔥 Could not delete product image ${id}:`, err.message);
  }
}

/**
 * Serves the stored bytes. Public, like the product list it belongs to, and
 * cached hard because the id changes whenever the photo does.
 */
export const serveProductImage = async (req, res) => {
  try {
    const doc = await db.collection(IMAGE_COLLECTION).doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ success: false, error: "Image not found" });

    const { data, contentType } = doc.data();
    if (!data) return res.status(404).json({ success: false, error: "Image not found" });

    const buffer = Buffer.from(data, "base64");
    res.set({
      "Content-Type": contentType || "image/jpeg",
      "Content-Length": String(buffer.length),
      "Cache-Control": "public, max-age=31536000, immutable",
    });
    return res.send(buffer);
  } catch (error) {
    console.error("🔥 Serve Product Image Error:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
