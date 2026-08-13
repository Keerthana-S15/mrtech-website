// import { db } from "../config/firebase.js";

// export const addProduct = async (req, res) => {
//   try {
//     const { name, category, price, stock, sku, description } = req.body;

//     if (!name || !category || !price || !sku) {
//       return res.status(400).json({ 
//         success: false,
//         error: "Name, category, price, and SKU are required" 
//       });
//     }

//     const imageUrl = req.file 
//       ? `http://localhost:3000/uploads/${req.file.filename}` 
//       : "";

//     console.log("➕ Adding new product:", { 
//       name, 
//       category, 
//       sku, 
//       imageUrl, 
//       description 
//     });

//     const docRef = await db.collection("products").add({
//       name,
//       category,
//       price: parseFloat(price),
//       stock: parseInt(stock) || 0,
//       sku,
//       image: imageUrl,
//       description: description || "",
//       createdAt: new Date().toISOString(),
//     });

//     console.log(`✅ Product added successfully with ID: ${docRef.id}`);

//     res.json({ 
//       success: true, 
//       message: "Product added successfully", 
//       id: docRef.id,
//       product: {
//         id: docRef.id,
//         name,
//         category,
//         price,
//         stock,
//         sku,
//         image: imageUrl,
//         description
//       }
//     });
//   } catch (error) {
//     console.error("🔥 Add Product Error:", error);
//     res.status(500).json({ 
//       success: false,
//       error: "Internal Server Error",
//       message: error.message 
//     });
//   }
// };

// export const getAllProducts = async (req, res) => {
//   try {
//     console.log("📦 Fetching all products...");

//     const snapshot = await db.collection("products").orderBy("createdAt", "desc").get();
    
//     if (snapshot.empty) {
//       console.log("ℹ️  No products found");
//       return res.json({ success: true, products: [] });
//     }

//     const products = [];
//     snapshot.forEach((doc) => {
//       const productData = doc.data();
//       products.push({ 
//         id: doc.id, 
//         name: productData.name,
//         category: productData.category,
//         price: productData.price,
//         stock: productData.stock,
//         sku: productData.sku,
//         image: productData.image || "",
//         description: productData.description || "",
//         createdAt: productData.createdAt
//       });
//     });

//     console.log(`✅ Found ${products.length} products`);

//     res.json({ 
//       success: true, 
//       products,
//       count: products.length 
//     });
//   } catch (error) {
//     console.error("🔥 Get Products Error:", error);
//     res.status(500).json({ 
//       success: false,
//       error: "Internal Server Error",
//       message: error.message 
//     });
//   }
// };

// export const getProductById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     console.log(`🔍 Fetching product with ID: ${id}`);

//     const doc = await db.collection("products").doc(id).get();

//     if (!doc.exists) {
//       console.log(`❌ Product not found: ${id}`);
//       return res.status(404).json({ 
//         success: false, 
//         error: "Product not found" 
//       });
//     }

//     const productData = doc.data();
//     const product = {
//       id: doc.id,
//       name: productData.name,
//       category: productData.category,
//       price: productData.price,
//       stock: productData.stock,
//       sku: productData.sku,
//       image: productData.image || "",
//       description: productData.description || "",
//       createdAt: productData.createdAt
//     };

//     console.log(`✅ Product found: ${product.name}`);

//     res.json({ 
//       success: true, 
//       product 
//     });
//   } catch (error) {
//     console.error("🔥 Get Product Error:", error);
//     res.status(500).json({ 
//       success: false,
//       error: "Internal Server Error",
//       message: error.message 
//     });
//   }
// };

// export const updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;

//     console.log(`✏️  Updating product ${id} with:`, updates);

//     const updateData = {
//       updatedAt: new Date().toISOString(),
//     };

//     if (updates.name) updateData.name = updates.name;
//     if (updates.category) updateData.category = updates.category;
//     if (updates.price !== undefined) updateData.price = parseFloat(updates.price);
//     if (updates.stock !== undefined) updateData.stock = parseInt(updates.stock);
//     if (updates.sku) updateData.sku = updates.sku;
//     if (updates.description !== undefined) updateData.description = updates.description;
    
//     if (req.file) {
//       updateData.image = `http://localhost:3000/uploads/${req.file.filename}`;
//     }

//     await db.collection("products").doc(id).update(updateData);

//     console.log(`✅ Product ${id} updated successfully`);

//     res.json({ 
//       success: true, 
//       message: "Product updated successfully",
//       updatedFields: Object.keys(updateData)
//     });
//   } catch (error) {
//     console.error("🔥 Update Product Error:", error);
//     res.status(500).json({ 
//       success: false,
//       error: "Internal Server Error",
//       message: error.message 
//     });
//   }
// };

// export const deleteProduct = async (req, res) => {
//   try {
//     const { id } = req.params;

//     console.log(`🗑️  Deleting product: ${id}`);

//     await db.collection("products").doc(id).delete();

//     console.log(`✅ Product ${id} deleted successfully`);

//     res.json({ 
//       success: true, 
//       message: "Product deleted successfully" 
//     });
//   } catch (error) {
//     console.error("🔥 Delete Product Error:", error);
//     res.status(500).json({ 
//       success: false,
//       error: "Internal Server Error",
//       message: error.message 
//     });
//   }
// };




// import { db } from "../config/firebase.js";

// export const addProduct = async (req, res) => {
//   try {
//     const { name, category, price, stock, sku, description } = req.body;

//     if (!name || !category || !price || !sku) {
//       return res.status(400).json({ 
//         success: false,
//         error: "Name, category, price, and SKU are required" 
//       });
//     }

//     const imageUrl = req.file 
//       ? `http://localhost:3000/uploads/${req.file.filename}` 
//       : "";

//     console.log("➕ Adding new product:", { name, category, sku, imageUrl, description });

//     const docRef = await db.collection("products").add({
//       name,
//       category,
//       price: parseFloat(price),
//       stock: parseInt(stock) || 0,
//       sku,
//       image: imageUrl,
//       description: description || "",
//       createdAt: new Date().toISOString(),
//     });

//     console.log(`✅ Product added successfully with ID: ${docRef.id}`);

//     res.json({ 
//       success: true, 
//       message: "Product added successfully", 
//       id: docRef.id,
//       product: { id: docRef.id, name, category, price, stock, sku, image: imageUrl, description }
//     });
//   } catch (error) {
//     console.error("🔥 Add Product Error:", error);
//     res.status(500).json({ success: false, error: "Internal Server Error", message: error.message });
//   }
// };

// export const getAllProducts = async (req, res) => {
//   try {
//     console.log("📦 Fetching all products...");

//     const snapshot = await db.collection("products").orderBy("createdAt", "desc").get();
    
//     if (snapshot.empty) {
//       console.log("ℹ️  No products found");
//       return res.json({ success: true, products: [] });
//     }

//     const products = [];
//     snapshot.forEach((doc) => {
//       const productData = doc.data();
//       products.push({ 
//         id: doc.id, 
//         name: productData.name,
//         category: productData.category,
//         price: productData.price,
//         stock: productData.stock,
//         sku: productData.sku,
//         image: productData.image || "",
//         description: productData.description || "",
//         createdAt: productData.createdAt
//       });
//     });

//     console.log(`✅ Found ${products.length} products`);
//     res.json({ success: true, products, count: products.length });
//   } catch (error) {
//     console.error("🔥 Get Products Error:", error);
//     res.status(500).json({ success: false, error: "Internal Server Error", message: error.message });
//   }
// };

// export const getProductById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log(`🔍 Fetching product with ID: ${id}`);

//     const doc = await db.collection("products").doc(id).get();

//     if (!doc.exists) {
//       console.log(`❌ Product not found: ${id}`);
//       return res.status(404).json({ success: false, error: "Product not found" });
//     }

//     const productData = doc.data();
//     const product = {
//       id: doc.id,
//       name: productData.name,
//       category: productData.category,
//       price: productData.price,
//       stock: productData.stock,
//       sku: productData.sku,
//       image: productData.image || "",
//       description: productData.description || "",
//       createdAt: productData.createdAt
//     };

//     console.log(`✅ Product found: ${product.name}`);
//     res.json({ success: true, product });
//   } catch (error) {
//     console.error("🔥 Get Product Error:", error);
//     res.status(500).json({ success: false, error: "Internal Server Error", message: error.message });
//   }
// };

// export const updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;

//     console.log(`✏️  Updating product ${id} with:`, updates);

//     const updateData = {
//       updatedAt: new Date().toISOString(),
//     };

//     if (updates.name) updateData.name = updates.name;
//     if (updates.category) updateData.category = updates.category;
//     if (updates.price !== undefined) updateData.price = parseFloat(updates.price);
//     if (updates.stock !== undefined) updateData.stock = parseInt(updates.stock);
//     if (updates.sku) updateData.sku = updates.sku;
//     if (updates.description !== undefined) updateData.description = updates.description;
    
//     // ✅ Fixed: Handle both file upload and direct image URL
//     if (req.file) {
//       updateData.image = `http://localhost:3000/uploads/${req.file.filename}`;
//     } else if (updates.image) {
//       updateData.image = updates.image;
//     }

//     await db.collection("products").doc(id).update(updateData);

//     console.log(`✅ Product ${id} updated successfully`);

//     res.json({ 
//       success: true, 
//       message: "Product updated successfully",
//       updatedFields: Object.keys(updateData)
//     });
//   } catch (error) {
//     console.error("🔥 Update Product Error:", error);
//     res.status(500).json({ success: false, error: "Internal Server Error", message: error.message });
//   }
// };

// export const deleteProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log(`🗑️  Deleting product: ${id}`);

//     await db.collection("products").doc(id).delete();

//     console.log(`✅ Product ${id} deleted successfully`);
//     res.json({ success: true, message: "Product deleted successfully" });
//   } catch (error) {
//     console.error("🔥 Delete Product Error:", error);
//     res.status(500).json({ success: false, error: "Internal Server Error", message: error.message });
//   }
// };






// import { db } from "../config/firebase.js";

// export const addProduct = async (req, res) => {
//   try {
//     const { name, category, price, stock, sku, description } = req.body;

//     if (!name || !category || !price || !sku) {
//       return res.status(400).json({ 
//         success: false,
//         error: "Name, category, price, and SKU are required" 
//       });
//     }

//     // ✅ FIX: Store relative path instead of hardcoded domain.
//     // This works on localhost AND production without changes.
//     const imageUrl = req.file 
//       ? `/uploads/${req.file.filename}` 
//       : "";

//     console.log("➕ Adding new product:", { name, category, sku, imageUrl, description });

//     const docRef = await db.collection("products").add({
//       name,
//       category,
//       price: parseFloat(price),
//       stock: parseInt(stock) || 0,
//       sku,
//       image: imageUrl,
//       description: description || "",
//       createdAt: new Date().toISOString(),
//     });

//     console.log(`✅ Product added successfully with ID: ${docRef.id}`);

//     res.json({ 
//       success: true, 
//       message: "Product added successfully", 
//       id: docRef.id,
//       product: { id: docRef.id, name, category, price, stock, sku, image: imageUrl, description }
//     });
//   } catch (error) {
//     console.error("🔥 Add Product Error:", error);
//     res.status(500).json({ success: false, error: "Internal Server Error", message: error.message });
//   }
// };

// export const getAllProducts = async (req, res) => {
//   try {
//     console.log("📦 Fetching all products...");

//     const snapshot = await db.collection("products").orderBy("createdAt", "desc").get();
    
//     if (snapshot.empty) {
//       console.log("ℹ️  No products found");
//       return res.json({ success: true, products: [] });
//     }

//     const products = [];
//     snapshot.forEach((doc) => {
//       const productData = doc.data();
//       products.push({ 
//         id: doc.id, 
//         name: productData.name,
//         category: productData.category,
//         price: productData.price,
//         stock: productData.stock,
//         sku: productData.sku,
//         image: productData.image || "",
//         description: productData.description || "",
//         createdAt: productData.createdAt
//       });
//     });

//     console.log(`✅ Found ${products.length} products`);
//     res.json({ success: true, products, count: products.length });
//   } catch (error) {
//     console.error("🔥 Get Products Error:", error);
//     res.status(500).json({ success: false, error: "Internal Server Error", message: error.message });
//   }
// };

// export const getProductById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log(`🔍 Fetching product with ID: ${id}`);

//     const doc = await db.collection("products").doc(id).get();

//     if (!doc.exists) {
//       console.log(`❌ Product not found: ${id}`);
//       return res.status(404).json({ success: false, error: "Product not found" });
//     }

//     const productData = doc.data();
//     const product = {
//       id: doc.id,
//       name: productData.name,
//       category: productData.category,
//       price: productData.price,
//       stock: productData.stock,
//       sku: productData.sku,
//       image: productData.image || "",
//       description: productData.description || "",
//       createdAt: productData.createdAt
//     };

//     console.log(`✅ Product found: ${product.name}`);
//     res.json({ success: true, product });
//   } catch (error) {
//     console.error("🔥 Get Product Error:", error);
//     res.status(500).json({ success: false, error: "Internal Server Error", message: error.message });
//   }
// };

// export const updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;

//     console.log(`✏️  Updating product ${id} with:`, updates);

//     const updateData = {
//       updatedAt: new Date().toISOString(),
//     };

//     if (updates.name) updateData.name = updates.name;
//     if (updates.category) updateData.category = updates.category;
//     if (updates.price !== undefined) updateData.price = parseFloat(updates.price);
//     if (updates.stock !== undefined) updateData.stock = parseInt(updates.stock);
//     if (updates.sku) updateData.sku = updates.sku;
//     if (updates.description !== undefined) updateData.description = updates.description;
    
//     // ✅ FIX: Store relative path instead of hardcoded domain.
//     if (req.file) {
//       updateData.image = `/uploads/${req.file.filename}`;
//     } else if (updates.image) {
//       updateData.image = updates.image;
//     }

//     await db.collection("products").doc(id).update(updateData);

//     console.log(`✅ Product ${id} updated successfully`);

//     res.json({ 
//       success: true, 
//       message: "Product updated successfully",
//       updatedFields: Object.keys(updateData)
//     });
//   } catch (error) {
//     console.error("🔥 Update Product Error:", error);
//     res.status(500).json({ success: false, error: "Internal Server Error", message: error.message });
//   }
// };

// export const deleteProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log(`🗑️  Deleting product: ${id}`);

//     await db.collection("products").doc(id).delete();

//     console.log(`✅ Product ${id} deleted successfully`);
//     res.json({ success: true, message: "Product deleted successfully" });
//   } catch (error) {
//     console.error("🔥 Delete Product Error:", error);
//     res.status(500).json({ success: false, error: "Internal Server Error", message: error.message });
//   }
// };





// import { db } from "../config/firebase.js";

// // ============================================
// // PUBLIC (storefront) — unchanged behavior.
// // Shows ALL products from ALL companies, since customers browse the shared
// // storefront. If you later want separate storefronts per company, this is
// // the endpoint that would need a companyId filter added.
// // ============================================

// export const getAllProducts = async (req, res) => {
//   try {
//     console.log("📦 Fetching all products (public storefront)...");

//     const snapshot = await db.collection("products").orderBy("createdAt", "desc").get();

//     if (snapshot.empty) {
//       return res.json({ success: true, products: [] });
//     }

//     const products = [];
//     snapshot.forEach((doc) => {
//       const productData = doc.data();
//       products.push({
//         id: doc.id,
//         name: productData.name,
//         category: productData.category,
//         price: productData.price,
//         stock: productData.stock,
//         sku: productData.sku,
//         image: productData.image || "",
//         description: productData.description || "",
//         createdAt: productData.createdAt,
//       });
//     });

//     res.json({ success: true, products, count: products.length });
//   } catch (error) {
//     console.error("🔥 Get Products Error:", error);
//     res.status(500).json({ success: false, error: "Internal Server Error", message: error.message });
//   }
// };

// export const getProductById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const doc = await db.collection("products").doc(id).get();

//     if (!doc.exists) {
//       return res.status(404).json({ success: false, error: "Product not found" });
//     }

//     const productData = doc.data();
//     const product = {
//       id: doc.id,
//       name: productData.name,
//       category: productData.category,
//       price: productData.price,
//       stock: productData.stock,
//       sku: productData.sku,
//       image: productData.image || "",
//       description: productData.description || "",
//       createdAt: productData.createdAt,
//     };

//     res.json({ success: true, product });
//   } catch (error) {
//     console.error("🔥 Get Product Error:", error);
//     res.status(500).json({ success: false, error: "Internal Server Error", message: error.message });
//   }
// };

// // ============================================
// // ADMIN (protected, company-scoped)
// // ============================================

// // ✅ NEW: Used by AdminDashboard instead of getAllProducts. Only returns
// // products belonging to the logged-in admin's company — unless they're
// // MRtech's super admin, who sees everything.
// export const getAdminProducts = async (req, res) => {
//   try {
//     const { companyId, isSuperAdmin } = req.admin;

//     let query = db.collection("products").orderBy("createdAt", "desc");
//     if (!isSuperAdmin) {
//       query = db.collection("products").where("companyId", "==", companyId);
//     }

//     const snapshot = await query.get();

//     if (snapshot.empty) {
//       return res.json({ success: true, products: [] });
//     }

//     const products = [];
//     snapshot.forEach((doc) => {
//       products.push({ id: doc.id, ...doc.data() });
//     });

//     res.json({ success: true, products, count: products.length });
//   } catch (error) {
//     console.error("🔥 Get Admin Products Error:", error);
//     res.status(500).json({ success: false, error: "Internal Server Error", message: error.message });
//   }
// };

// export const addProduct = async (req, res) => {
//   try {
//     const { name, category, price, stock, sku, description } = req.body;
//     const { companyId, isSuperAdmin } = req.admin;

//     if (!name || !category || !price || !sku) {
//       return res.status(400).json({
//         success: false,
//         error: "Name, category, price, and SKU are required",
//       });
//     }

//     // Super admin adding a product must specify which company it belongs to
//     const targetCompanyId = isSuperAdmin ? (req.body.companyId || companyId) : companyId;

//     if (!targetCompanyId) {
//       return res.status(400).json({ success: false, error: "companyId is required" });
//     }

//     const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

//     const docRef = await db.collection("products").add({
//       name,
//       category,
//       price: parseFloat(price),
//       stock: parseInt(stock) || 0,
//       sku,
//       image: imageUrl,
//       description: description || "",
//       companyId: targetCompanyId, // ✅ NEW: tags this product to a company
//       createdAt: new Date().toISOString(),
//     });

//     res.json({
//       success: true,
//       message: "Product added successfully",
//       id: docRef.id,
//       product: { id: docRef.id, name, category, price, stock, sku, image: imageUrl, description, companyId: targetCompanyId },
//     });
//   } catch (error) {
//     console.error("🔥 Add Product Error:", error);
//     res.status(500).json({ success: false, error: "Internal Server Error", message: error.message });
//   }
// };

// export const updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;
//     const { companyId, isSuperAdmin } = req.admin;

//     // ✅ NEW: Verify this product belongs to the admin's company before allowing edits
//     const existingDoc = await db.collection("products").doc(id).get();
//     if (!existingDoc.exists) {
//       return res.status(404).json({ success: false, error: "Product not found" });
//     }
//     if (!isSuperAdmin && existingDoc.data().companyId !== companyId) {
//       return res.status(403).json({ success: false, error: "You do not have access to this product" });
//     }

//     const updateData = {
//       updatedAt: new Date().toISOString(),
//     };

//     if (updates.name) updateData.name = updates.name;
//     if (updates.category) updateData.category = updates.category;
//     if (updates.price !== undefined) updateData.price = parseFloat(updates.price);
//     if (updates.stock !== undefined) updateData.stock = parseInt(updates.stock);
//     if (updates.sku) updateData.sku = updates.sku;
//     if (updates.description !== undefined) updateData.description = updates.description;

//     if (req.file) {
//       updateData.image = `/uploads/${req.file.filename}`;
//     } else if (updates.image) {
//       updateData.image = updates.image;
//     }

//     await db.collection("products").doc(id).update(updateData);

//     res.json({
//       success: true,
//       message: "Product updated successfully",
//       updatedFields: Object.keys(updateData),
//     });
//   } catch (error) {
//     console.error("🔥 Update Product Error:", error);
//     res.status(500).json({ success: false, error: "Internal Server Error", message: error.message });
//   }
// };

// export const deleteProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { companyId, isSuperAdmin } = req.admin;

//     // ✅ NEW: Verify ownership before allowing delete
//     const existingDoc = await db.collection("products").doc(id).get();
//     if (!existingDoc.exists) {
//       return res.status(404).json({ success: false, error: "Product not found" });
//     }
//     if (!isSuperAdmin && existingDoc.data().companyId !== companyId) {
//       return res.status(403).json({ success: false, error: "You do not have access to this product" });
//     }

//     await db.collection("products").doc(id).delete();

//     res.json({ success: true, message: "Product deleted successfully" });
//   } catch (error) {
//     console.error("🔥 Delete Product Error:", error);
//     res.status(500).json({ success: false, error: "Internal Server Error", message: error.message });
//   }
// };





import { db } from "../config/firebase.js";

// ============================================
// PUBLIC (storefront) — shows ALL products from ALL companies (shared
// storefront/marketplace model). companyId is now included so the frontend
// (cart/checkout) can tag which company each item belongs to.
// ============================================

export const getAllProducts = async (req, res) => {
  try {
    console.log("📦 Fetching all products (public storefront)...");

    const snapshot = await db.collection("products").orderBy("createdAt", "desc").get();

    if (snapshot.empty) {
      return res.json({ success: true, products: [] });
    }

    const products = [];
    snapshot.forEach((doc) => {
      const productData = doc.data();
      products.push({
        id: doc.id,
        name: productData.name,
        category: productData.category,
        price: productData.price,
        stock: productData.stock,
        sku: productData.sku,
        image: productData.image || "",
        description: productData.description || "",
        companyId: productData.companyId || "mrtech",
        createdAt: productData.createdAt,
      });
    });

    res.json({ success: true, products, count: products.length });
  } catch (error) {
    console.error("🔥 Get Products Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error", message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection("products").doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }

    const productData = doc.data();
    const product = {
      id: doc.id,
      name: productData.name,
      category: productData.category,
      price: productData.price,
      stock: productData.stock,
      sku: productData.sku,
      image: productData.image || "",
      description: productData.description || "",
      companyId: productData.companyId || "mrtech",
      createdAt: productData.createdAt,
    };

    res.json({ success: true, product });
  } catch (error) {
    console.error("🔥 Get Product Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error", message: error.message });
  }
};

// ============================================
// ADMIN (protected, company-scoped)
// ============================================

// Used by AdminDashboard instead of getAllProducts. Only returns
// products belonging to the logged-in admin's company — unless they're
// MRtech's super admin, who sees everything.
export const getAdminProducts = async (req, res) => {
  try {
    const { companyId, isSuperAdmin } = req.admin;

    let query = db.collection("products").orderBy("createdAt", "desc");
    if (!isSuperAdmin) {
      query = db.collection("products").where("companyId", "==", companyId);
    }

    const snapshot = await query.get();

    if (snapshot.empty) {
      return res.json({ success: true, products: [] });
    }

    const products = [];
    snapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });

    res.json({ success: true, products, count: products.length });
  } catch (error) {
    console.error("🔥 Get Admin Products Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error", message: error.message });
  }
};

export const addProduct = async (req, res) => {
  try {
    const { name, category, price, stock, sku, description } = req.body;
    const { companyId, isSuperAdmin } = req.admin;

    if (!name || !category || !price || !sku) {
      return res.status(400).json({
        success: false,
        error: "Name, category, price, and SKU are required",
      });
    }

    // Super admin adding a product must specify which company it belongs to
    const targetCompanyId = isSuperAdmin ? (req.body.companyId || companyId) : companyId;

    if (!targetCompanyId) {
      return res.status(400).json({ success: false, error: "companyId is required" });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const docRef = await db.collection("products").add({
      name,
      category,
      price: parseFloat(price),
      stock: parseInt(stock) || 0,
      sku,
      image: imageUrl,
      description: description || "",
      companyId: targetCompanyId,
      createdAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: "Product added successfully",
      id: docRef.id,
      product: { id: docRef.id, name, category, price, stock, sku, image: imageUrl, description, companyId: targetCompanyId },
    });
  } catch (error) {
    console.error("🔥 Add Product Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error", message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { companyId, isSuperAdmin } = req.admin;

    // Verify this product belongs to the admin's company before allowing edits
    const existingDoc = await db.collection("products").doc(id).get();
    if (!existingDoc.exists) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }
    if (!isSuperAdmin && existingDoc.data().companyId !== companyId) {
      return res.status(403).json({ success: false, error: "You do not have access to this product" });
    }

    const updateData = {
      updatedAt: new Date().toISOString(),
    };

    if (updates.name) updateData.name = updates.name;
    if (updates.category) updateData.category = updates.category;
    if (updates.price !== undefined) updateData.price = parseFloat(updates.price);
    if (updates.stock !== undefined) updateData.stock = parseInt(updates.stock);
    if (updates.sku) updateData.sku = updates.sku;
    if (updates.description !== undefined) updateData.description = updates.description;

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    } else if (updates.image) {
      updateData.image = updates.image;
    }

    await db.collection("products").doc(id).update(updateData);

    res.json({
      success: true,
      message: "Product updated successfully",
      updatedFields: Object.keys(updateData),
    });
  } catch (error) {
    console.error("🔥 Update Product Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error", message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId, isSuperAdmin } = req.admin;

    // Verify ownership before allowing delete
    const existingDoc = await db.collection("products").doc(id).get();
    if (!existingDoc.exists) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }
    if (!isSuperAdmin && existingDoc.data().companyId !== companyId) {
      return res.status(403).json({ success: false, error: "You do not have access to this product" });
    }

    await db.collection("products").doc(id).delete();

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("🔥 Delete Product Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error", message: error.message });
  }
};