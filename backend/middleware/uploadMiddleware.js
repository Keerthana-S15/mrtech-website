import multer from "multer";
import path from "path";
import { MAX_IMAGE_BYTES } from "../controllers/productImageController.js";

// Files are held in memory and written to Firestore by the controller, not to
// the server's own disk. Render wipes anything written at runtime on the next
// restart, which used to leave products pointing at /uploads paths whose files
// no longer existed. See productImageController.js for the whole story.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

const upload = multer({
  storage,
  // Multer's ceiling. The controller enforces MAX_IMAGE_BYTES, which is what
  // Firestore can actually hold; this is just a cheap early reject.
  limits: { fileSize: MAX_IMAGE_BYTES },
  fileFilter,
});

/**
 * upload.single("image") with its errors turned into answers the admin form
 * can show. Left unhandled, multer throws into the generic error path and the
 * form gets a bare 500 — "File too large" and "Only image files are allowed"
 * are both things the person can act on, so they should say so.
 */
export const uploadProductImage = (req, res, next) =>
  upload.single("image")(req, res, (err) => {
    if (!err) return next();

    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
          success: false,
          error: `Image is too large. Please upload one under ${MAX_IMAGE_BYTES / 1024} KB.`,
        });
      }
      return res.status(400).json({ success: false, error: err.message });
    }

    // fileFilter rejections land here
    return res.status(400).json({ success: false, error: err.message || "Upload failed" });
  });

export default upload;
