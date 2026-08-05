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






import { db } from "../config/firebase.js";

export const addProduct = async (req, res) => {
  try {
    const { name, category, price, stock, sku, description } = req.body;

    if (!name || !category || !price || !sku) {
      return res.status(400).json({ 
        success: false,
        error: "Name, category, price, and SKU are required" 
      });
    }

    // ✅ FIX: Store relative path instead of hardcoded domain.
    // This works on localhost AND production without changes.
    const imageUrl = req.file 
      ? `/uploads/${req.file.filename}` 
      : "";

    console.log("➕ Adding new product:", { name, category, sku, imageUrl, description });

    const docRef = await db.collection("products").add({
      name,
      category,
      price: parseFloat(price),
      stock: parseInt(stock) || 0,
      sku,
      image: imageUrl,
      description: description || "",
      createdAt: new Date().toISOString(),
    });

    console.log(`✅ Product added successfully with ID: ${docRef.id}`);

    res.json({ 
      success: true, 
      message: "Product added successfully", 
      id: docRef.id,
      product: { id: docRef.id, name, category, price, stock, sku, image: imageUrl, description }
    });
  } catch (error) {
    console.error("🔥 Add Product Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error", message: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    console.log("📦 Fetching all products...");

    const snapshot = await db.collection("products").orderBy("createdAt", "desc").get();
    
    if (snapshot.empty) {
      console.log("ℹ️  No products found");
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
        createdAt: productData.createdAt
      });
    });

    console.log(`✅ Found ${products.length} products`);
    res.json({ success: true, products, count: products.length });
  } catch (error) {
    console.error("🔥 Get Products Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error", message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 Fetching product with ID: ${id}`);

    const doc = await db.collection("products").doc(id).get();

    if (!doc.exists) {
      console.log(`❌ Product not found: ${id}`);
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
      createdAt: productData.createdAt
    };

    console.log(`✅ Product found: ${product.name}`);
    res.json({ success: true, product });
  } catch (error) {
    console.error("🔥 Get Product Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error", message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    console.log(`✏️  Updating product ${id} with:`, updates);

    const updateData = {
      updatedAt: new Date().toISOString(),
    };

    if (updates.name) updateData.name = updates.name;
    if (updates.category) updateData.category = updates.category;
    if (updates.price !== undefined) updateData.price = parseFloat(updates.price);
    if (updates.stock !== undefined) updateData.stock = parseInt(updates.stock);
    if (updates.sku) updateData.sku = updates.sku;
    if (updates.description !== undefined) updateData.description = updates.description;
    
    // ✅ FIX: Store relative path instead of hardcoded domain.
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    } else if (updates.image) {
      updateData.image = updates.image;
    }

    await db.collection("products").doc(id).update(updateData);

    console.log(`✅ Product ${id} updated successfully`);

    res.json({ 
      success: true, 
      message: "Product updated successfully",
      updatedFields: Object.keys(updateData)
    });
  } catch (error) {
    console.error("🔥 Update Product Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error", message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️  Deleting product: ${id}`);

    await db.collection("products").doc(id).delete();

    console.log(`✅ Product ${id} deleted successfully`);
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("🔥 Delete Product Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error", message: error.message });
  }
};