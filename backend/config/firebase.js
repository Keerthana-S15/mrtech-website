// config/firebase.js
import admin from "firebase-admin";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ES Module __dirname alternative
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Support both local development (file) AND hosting platforms like Render (environment variable)
let serviceAccount;
let credentialSource;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  credentialSource = "FIREBASE_SERVICE_ACCOUNT env var";
} else {
  const keyPath = path.join(__dirname, "../serviceAccountKey.json");
  serviceAccount = JSON.parse(readFileSync(keyPath, "utf8"));
  credentialSource = `local file ${keyPath}`;
  if (process.env.RENDER || process.env.NODE_ENV === "production") {
    // The file is a dev-only fallback. In production it means the env var was never set.
    console.warn("⚠️  FIREBASE_SERVICE_ACCOUNT is not set — falling back to serviceAccountKey.json. Set the env var on Render.");
  }
}

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Connect to Firestore
const db = admin.firestore();
console.log(`✅ Firebase Admin initialized (project: ${serviceAccount.project_id}, key id: ${String(serviceAccount.private_key_id).slice(0, 8)}…, source: ${credentialSource})`);

// Tracks whether Firestore actually accepts our credentials. initializeApp()
// never contacts Google, so a revoked key only surfaces on the first query —
// which previously showed up as an empty product list. Probe once at startup
// and expose the result via /api/health.
let firestoreStatus = { ok: null, checkedAt: null, error: null };

export const checkFirestore = async () => {
  try {
    await db.collection("products").limit(1).get();
    firestoreStatus = { ok: true, checkedAt: new Date().toISOString(), error: null };
  } catch (error) {
    firestoreStatus = { ok: false, checkedAt: new Date().toISOString(), error: error.message };
    console.error("🔥🔥🔥 FIRESTORE CREDENTIALS REJECTED 🔥🔥🔥");
    console.error(`   ${error.message}`);
    console.error(`   Credential source: ${credentialSource}`);
    console.error("   The service-account key is revoked, expired or wrong. Every DB-backed");
    console.error("   route (products, login, orders) will return 500 until it is replaced.");
    console.error("   Fix: Firebase console → Project settings → Service accounts → Generate");
    console.error("   new private key → paste the JSON into FIREBASE_SERVICE_ACCOUNT on Render.");
  }
  return firestoreStatus;
};

export const getFirestoreStatus = () => firestoreStatus;

checkFirestore();

export { db };