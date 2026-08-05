import { db } from "./config/firebase.js";

const fixImageUrls = async () => {
  console.log("🔍 Scanning products collection...");

  const snapshot = await db.collection("products").get();

  if (snapshot.empty) {
    console.log("ℹ️  No products found. Nothing to fix.");
    return;
  }

  let fixedCount = 0;
  let skippedCount = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const currentImage = data.image || "";

    if (!currentImage) {
      skippedCount++;
      continue;
    }

    const match = currentImage.match(/\/uploads\/[^/?#]+/);

    if (!match) {
      console.log(`⚠️  Skipping "${data.name}" — unrecognized image format: ${currentImage}`);
      skippedCount++;
      continue;
    }

    const relativePath = match[0];

    if (currentImage === relativePath) {
      skippedCount++;
      continue;
    }

    await db.collection("products").doc(doc.id).update({
      image: relativePath,
      updatedAt: new Date().toISOString(),
    });

    console.log(`✅ Fixed "${data.name}": ${currentImage}  →  ${relativePath}`);
    fixedCount++;
  }

  console.log("\n----------------------------------------");
  console.log(`✅ Done. Fixed: ${fixedCount}, Skipped: ${skippedCount}`);
  console.log("----------------------------------------");
  process.exit(0);
};

fixImageUrls().catch((err) => {
  console.error("🔥 Migration failed:", err);
  process.exit(1);
});