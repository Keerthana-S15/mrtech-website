// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { useCart } from "../context/CartContext";
// import "./Purchase.css";

// const Purchase = () => {
//   const { cartItems, addToCart, removeFromCart, getTotalItems, getTotalPrice } = useCart();
//   const [products, setProducts] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showCart, setShowCart] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   // ✅ Fetch products from backend
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         // ✅ FIX: relative path instead of hardcoded http://localhost:3000
//         const response = await fetch("/api/products");
//         const data = await response.json();
//         if (data.success) {
//           setProducts(data.products);
//         }
//       } catch (error) {
//         console.error("Error fetching products:", error);
//         alert("Failed to load products. Please refresh the page.");
//       }
//     };

//     fetchProducts();
//   }, []);

//   // ✅ Filter products by category + search
//   const filteredProducts = products.filter((product) => {
//     const productCategory = product.category?.trim().toLowerCase();
//     const selected = selectedCategory.toLowerCase();

//     const matchesCategory = selected === "all" || productCategory === selected;

//     const matchesSearch = product.name
//       ?.toLowerCase()
//       .includes(searchQuery.toLowerCase());

//     return matchesCategory && matchesSearch;
//   });

//   // ✅ Handle add to cart
//   const handleAddToCart = (product) => {
//     addToCart(product);
//     alert(`${product.name} added to cart!`);
//   };

//   // ✅ Cart stats
//   const cartTotal = getTotalPrice();
//   const cartCount = getTotalItems();

//   return (
//     <div className="purchase-page">
//       {/* Hero Section */}
//       <div className="purchase-hero">
//         <div className="hero-content">
//           <h1>G Care Medical Equipment Store</h1>
//           <p>Quality Healthcare Products for Professionals & Individuals</p>
//           <div className="hero-stats">
//             <div className="stat-item">
//               <span className="stat-number">{products.length}</span>
//               <span className="stat-label">Products</span>
//             </div>
//             <div className="stat-item">
//               <span className="stat-number">ISO</span>
//               <span className="stat-label">Certified</span>
//             </div>
//             <div className="stat-item">
//               <span className="stat-number">24/7</span>
//               <span className="stat-label">Support</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Container */}
//       <div className="purchase-container">
//         {/* Filter Section */}
//         <div className="filter-section">
//           <div className="search-box">
//             <input
//               type="text"
//               placeholder="🔍 Search products..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>

//           <div className="category-filters">
//             {["All", "Non-Consumable", "Consumable"].map((category) => (
//               <button
//                 key={category}
//                 className={`filter-btn ${selectedCategory === category ? "active" : ""}`}
//                 onClick={() => setSelectedCategory(category)}
//               >
//                 {category}
//               </button>
//             ))}
//           </div>

//           <button className="cart-toggle-btn" onClick={() => setShowCart(!showCart)}>
//             🛒 Cart ({cartCount})
//           </button>
//         </div>

//         {/* Products Grid */}
//         <div className="products-grid">
//           {filteredProducts.length > 0 ? (
//             filteredProducts.map((product) => (
//               <div key={product.id} className="product-card">
//                 <div 
//                   className="product-image"
//                   onClick={() => setSelectedProduct(product)}
//                   style={{ cursor: "pointer" }}
//                 >
//                   {product.image ? (
//                     <img 
//                       src={product.image} 
//                       alt={product.name}
//                       style={{ 
//                         width: "100%", 
//                         height: "100%", 
//                         objectFit: "contain" 
//                       }}
//                     />
//                   ) : (
//                     <span className="product-emoji">🧴</span>
//                   )}
//                   <span className="product-category-badge">
//                     {product.category}
//                   </span>
//                 </div>
//                 <div className="product-info">
//                   <h3 
//                     className="product-name"
//                     onClick={() => setSelectedProduct(product)}
//                     style={{ cursor: "pointer" }}
//                   >
//                     {product.name}
//                   </h3>
//                   <p className="product-sku">SKU: {product.sku}</p>
                  
//                   {product.description && (
//                     <p 
//                       className="product-description"
//                       style={{
//                         fontSize: 13,
//                         color: "#666",
//                         marginBottom: 10,
//                         display: "-webkit-box",
//                         WebkitLineClamp: 2,
//                         WebkitBoxOrient: "vertical",
//                         overflow: "hidden"
//                       }}
//                     >
//                       {product.description}
//                     </p>
//                   )}
                  
//                   <div className="product-footer">
//                     <div className="product-price">
//                       <span className="price-label">₹</span>
//                       <span className="price-value">{product.price}</span>
//                     </div>
//                     <div className="product-stock">
//                       Stock: <strong>{product.stock}</strong>
//                     </div>
//                   </div>
//                   <button
//                     className="add-to-cart-btn"
//                     onClick={() => handleAddToCart(product)}
//                   >
//                     Add to Cart
//                   </button>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="no-products">
//               <p>No products found</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Cart Sidebar */}
//       {showCart && (
//         <div className="cart-overlay" onClick={() => setShowCart(false)}>
//           <div className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
//             <div className="cart-header">
//               <h2>Shopping Cart ({cartCount} items)</h2>
//               <button className="close-cart-btn" onClick={() => setShowCart(false)}>
//                 ✕
//               </button>
//             </div>

//             <div className="cart-items">
//               {cartItems.length === 0 ? (
//                 <div className="empty-cart">
//                   <p>Your cart is empty</p>
//                   <span>🛒</span>
//                 </div>
//               ) : (
//                 cartItems.map((item) => (
//                   <div key={item.id} className="cart-item">
//                     {item.image ? (
//                       <img 
//                         src={item.image} 
//                         alt={item.name}
//                         style={{
//                           width: 60,
//                           height: 60,
//                           objectFit: "cover",
//                           borderRadius: 8
//                         }}
//                       />
//                     ) : (
//                       <span className="cart-item-emoji">🧴</span>
//                     )}
//                     <div className="cart-item-info">
//                       <h4>{item.name}</h4>
//                       <p>
//                         ₹{item.price} × {item.quantity}
//                       </p>
//                     </div>
//                     <div className="cart-item-total">₹{item.price * item.quantity}</div>
//                     <button
//                       className="remove-btn"
//                       onClick={() => removeFromCart(item.id)}
//                     >
//                       🗑️
//                     </button>
//                   </div>
//                 ))
//               )}
//             </div>

//             {cartItems.length > 0 && (
//               <div className="cart-footer">
//                 <div className="cart-total">
//                   <span>Total:</span>
//                   <span className="total-amount">₹{cartTotal}</span>
//                 </div>
//                 <Link to="/checkout" className="checkout-btn">
//                   Proceed to Checkout
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Product Details Modal */}
//       {selectedProduct && (
//         <div 
//           className="modal-overlay" 
//           onClick={() => setSelectedProduct(null)}
//           style={{ zIndex: 2000 }}
//         >
//           <div 
//             className="modal-content"
//             onClick={(e) => e.stopPropagation()}
//             style={{ maxWidth: 700 }}
//           >
//             <div className="modal-header">
//               <h2>{selectedProduct.name}</h2>
//               <button 
//                 className="close-modal" 
//                 onClick={() => setSelectedProduct(null)}
//               >
//                 ✕
//               </button>
//             </div>
//             <div className="modal-body">
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>
//                 <div>
//                   {selectedProduct.image ? (
//                     <img 
//                       src={selectedProduct.image} 
//                       alt={selectedProduct.name}
//                       style={{
//                         width: "100%",
//                         borderRadius: 15,
//                         border: "2px solid #f0f0f0"
//                       }}
//                     />
//                   ) : (
//                     <div 
//                       style={{
//                         width: "100%",
//                         height: 300,
//                         background: "#f5f5f5",
//                         borderRadius: 15,
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         fontSize: 80
//                       }}
//                     >
//                       🧴
//                     </div>
//                   )}
//                 </div>
                
//                 <div>
//                   <p style={{ 
//                     fontSize: 12, 
//                     color: "#999", 
//                     marginBottom: 10,
//                     fontFamily: "monospace"
//                   }}>
//                     SKU: {selectedProduct.sku}
//                   </p>
                  
//                   <div style={{ marginBottom: 20 }}>
//                     <span style={{
//                       background: "rgba(0, 51, 61, 0.1)",
//                       color: "#00333d",
//                       padding: "6px 12px",
//                       borderRadius: 20,
//                       fontSize: 12,
//                       fontWeight: 600
//                     }}>
//                       {selectedProduct.category}
//                     </span>
//                   </div>

//                   <h3 style={{ 
//                     fontSize: 16, 
//                     color: "#00333d", 
//                     marginBottom: 10,
//                     borderLeft: "4px solid #ff6600",
//                     paddingLeft: 10
//                   }}>
//                     Description
//                   </h3>
//                   <p style={{ 
//                     fontSize: 14, 
//                     color: "#666", 
//                     lineHeight: 1.6,
//                     marginBottom: 20
//                   }}>
//                     {selectedProduct.description || "No description available"}
//                   </p>

//                   <div style={{ 
//                     padding: 20, 
//                     background: "#f9f9f9", 
//                     borderRadius: 10,
//                     marginBottom: 20
//                   }}>
//                     <div style={{ 
//                       display: "flex", 
//                       justifyContent: "space-between",
//                       marginBottom: 10
//                     }}>
//                       <span style={{ color: "#666" }}>Price:</span>
//                       <span style={{ 
//                         fontSize: 24, 
//                         fontWeight: 700, 
//                         color: "#ff6600" 
//                       }}>
//                         ₹{selectedProduct.price}
//                       </span>
//                     </div>
//                     <div style={{ 
//                       display: "flex", 
//                       justifyContent: "space-between" 
//                     }}>
//                       <span style={{ color: "#666" }}>Stock:</span>
//                       <span style={{ fontWeight: 600, color: "#00333d" }}>
//                         {selectedProduct.stock} units
//                       </span>
//                     </div>
//                   </div>

//                   <button
//                     style={{
//                       width: "100%",
//                       padding: 16,
//                       background: "linear-gradient(135deg, #ff6600, #ff8c00)",
//                       color: "white",
//                       border: "none",
//                       borderRadius: 10,
//                       fontWeight: 600,
//                       cursor: "pointer",
//                       fontSize: 16,
//                       boxShadow: "0 4px 15px rgba(255, 102, 0, 0.3)",
//                       transition: "all 0.3s ease"
//                     }}
//                     onClick={() => {
//                       handleAddToCart(selectedProduct);
//                       setSelectedProduct(null);
//                     }}
//                     onMouseOver={(e) => {
//                       e.target.style.transform = "translateY(-2px)";
//                       e.target.style.boxShadow = "0 6px 20px rgba(255, 102, 0, 0.4)";
//                     }}
//                     onMouseOut={(e) => {
//                       e.target.style.transform = "translateY(0)";
//                       e.target.style.boxShadow = "0 4px 15px rgba(255, 102, 0, 0.3)";
//                     }}
//                   >
//                     Add to Cart
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Purchase;




// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { useCart } from "../context/CartContext";
// import "./Purchase.css";

// const Purchase = () => {
//   const { cartItems, addToCart, removeFromCart, updateQuantity, getTotalItems, getTotalPrice } = useCart();
//   const [products, setProducts] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showCart, setShowCart] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await fetch("/api/products");
//         const data = await response.json();
//         if (data.success) {
//           setProducts(data.products);
//         }
//       } catch (error) {
//         console.error("Error fetching products:", error);
//         alert("Failed to load products. Please refresh the page.");
//       }
//     };

//     fetchProducts();
//   }, []);

//   const filteredProducts = products.filter((product) => {
//     const productCategory = product.category?.trim().toLowerCase();
//     const selected = selectedCategory.toLowerCase();

//     const matchesCategory = selected === "all" || productCategory === selected;

//     const matchesSearch = product.name
//       ?.toLowerCase()
//       .includes(searchQuery.toLowerCase());

//     return matchesCategory && matchesSearch;
//   });

//   const handleAddToCart = (product) => {
//     addToCart(product);
//   };

//   const getCartQuantity = (productId) => {
//     const item = cartItems.find((i) => i.id === productId);
//     return item ? item.quantity : 0;
//   };

//   const cartTotal = getTotalPrice();
//   const cartCount = getTotalItems();

//   return (
//     <div className="purchase-page">
//       <div className="purchase-hero">
//         <div className="hero-content">
//           <h1>G Care Medical Equipment Store</h1>
//           <p>Quality Healthcare Products for Professionals & Individuals</p>
//           <div className="hero-stats">
//             <div className="stat-item">
//               <span className="stat-number">{products.length}</span>
//               <span className="stat-label">Products</span>
//             </div>
//             <div className="stat-item">
//               <span className="stat-number">ISO</span>
//               <span className="stat-label">Certified</span>
//             </div>
//             <div className="stat-item">
//               <span className="stat-number">24/7</span>
//               <span className="stat-label">Support</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="purchase-container">
//         <div className="filter-section">
//           <div className="search-box">
//             <input
//               type="text"
//               placeholder="🔍 Search products..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>

//           <div className="category-filters">
//             {["All", "Non-Consumable", "Consumable"].map((category) => (
//               <button
//                 key={category}
//                 className={`filter-btn ${selectedCategory === category ? "active" : ""}`}
//                 onClick={() => setSelectedCategory(category)}
//               >
//                 {category}
//               </button>
//             ))}
//           </div>

//           <button className="cart-toggle-btn" onClick={() => setShowCart(!showCart)}>
//             🛒 Cart ({cartCount})
//           </button>
//         </div>

//         <div className="products-grid">
//           {filteredProducts.length > 0 ? (
//             filteredProducts.map((product) => {
//               const qtyInCart = getCartQuantity(product.id);

//               return (
//                 <div key={product.id} className="product-card">
//                   <div
//                     className="product-image"
//                     onClick={() => setSelectedProduct(product)}
//                     style={{ cursor: "pointer" }}
//                   >
//                     {product.image ? (
//                       <img
//                         src={product.image}
//                         alt={product.name}
//                         style={{ width: "100%", height: "100%", objectFit: "contain" }}
//                       />
//                     ) : (
//                       <span className="product-emoji">🧴</span>
//                     )}
//                     <span className="product-category-badge">{product.category}</span>
//                   </div>
//                   <div className="product-info">
//                     <h3
//                       className="product-name"
//                       onClick={() => setSelectedProduct(product)}
//                       style={{ cursor: "pointer" }}
//                     >
//                       {product.name}
//                     </h3>
//                     <p className="product-sku">SKU: {product.sku}</p>

//                     {product.description && (
//                       <p
//                         className="product-description"
//                         style={{
//                           fontSize: 13,
//                           color: "#666",
//                           marginBottom: 10,
//                           display: "-webkit-box",
//                           WebkitLineClamp: 2,
//                           WebkitBoxOrient: "vertical",
//                           overflow: "hidden",
//                         }}
//                       >
//                         {product.description}
//                       </p>
//                     )}

//                     <div className="product-footer">
//                       <div className="product-price">
//                         <span className="price-label">₹</span>
//                         <span className="price-value">{product.price}</span>
//                       </div>
//                       <div className="product-stock">
//                         Stock: <strong>{product.stock}</strong>
//                       </div>
//                     </div>

//                     {qtyInCart === 0 ? (
//                       <button
//                         className="add-to-cart-btn"
//                         onClick={() => handleAddToCart(product)}
//                         disabled={product.stock === 0}
//                       >
//                         {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
//                       </button>
//                     ) : (
//                       <div
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "space-between",
//                           background: "#ff6600",
//                           borderRadius: 8,
//                           padding: "4px",
//                           marginTop: 8,
//                         }}
//                       >
//                         <button
//                           aria-label="Decrease quantity"
//                           onClick={() => updateQuantity(product.id, qtyInCart - 1)}
//                           style={{
//                             width: 36,
//                             height: 36,
//                             border: "none",
//                             background: "transparent",
//                             color: "white",
//                             fontSize: 20,
//                             fontWeight: 600,
//                             cursor: "pointer",
//                             borderRadius: 6,
//                           }}
//                         >
//                           −
//                         </button>
//                         <span style={{ color: "white", fontWeight: 600, fontSize: 15 }}>
//                           {qtyInCart}
//                         </span>
//                         <button
//                           aria-label="Increase quantity"
//                           onClick={() => {
//                             if (qtyInCart < product.stock) {
//                               updateQuantity(product.id, qtyInCart + 1);
//                             }
//                           }}
//                           disabled={qtyInCart >= product.stock}
//                           style={{
//                             width: 36,
//                             height: 36,
//                             border: "none",
//                             background: "transparent",
//                             color: "white",
//                             fontSize: 20,
//                             fontWeight: 600,
//                             cursor: qtyInCart >= product.stock ? "not-allowed" : "pointer",
//                             opacity: qtyInCart >= product.stock ? 0.5 : 1,
//                             borderRadius: 6,
//                           }}
//                         >
//                           +
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })
//           ) : (
//             <div className="no-products">
//               <p>No products found</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {showCart && (
//         <div className="cart-overlay" onClick={() => setShowCart(false)}>
//           <div className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
//             <div className="cart-header">
//               <h2>Shopping Cart ({cartCount} items)</h2>
//               <button className="close-cart-btn" onClick={() => setShowCart(false)}>
//                 ✕
//               </button>
//             </div>

//             <div className="cart-items">
//               {cartItems.length === 0 ? (
//                 <div className="empty-cart">
//                   <p>Your cart is empty</p>
//                   <span>🛒</span>
//                 </div>
//               ) : (
//                 cartItems.map((item) => (
//                   <div key={item.id} className="cart-item">
//                     {item.image ? (
//                       <img
//                         src={item.image}
//                         alt={item.name}
//                         style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }}
//                       />
//                     ) : (
//                       <span className="cart-item-emoji">🧴</span>
//                     )}
//                     <div className="cart-item-info">
//                       <h4>{item.name}</h4>
//                       <p>
//                         ₹{item.price} × {item.quantity}
//                       </p>
//                     </div>
//                     <div className="cart-item-total">₹{item.price * item.quantity}</div>
//                     <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
//                       🗑️
//                     </button>
//                   </div>
//                 ))
//               )}
//             </div>

//             {cartItems.length > 0 && (
//               <div className="cart-footer">
//                 <div className="cart-total">
//                   <span>Total:</span>
//                   <span className="total-amount">₹{cartTotal}</span>
//                 </div>
//                 <Link to="/checkout" className="checkout-btn">
//                   Proceed to Checkout
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {selectedProduct && (
//         <div
//           className="modal-overlay"
//           onClick={() => setSelectedProduct(null)}
//           style={{ zIndex: 2000 }}
//         >
//           <div
//             className="modal-content"
//             onClick={(e) => e.stopPropagation()}
//             style={{ maxWidth: 700 }}
//           >
//             <div className="modal-header">
//               <h2>{selectedProduct.name}</h2>
//               <button className="close-modal" onClick={() => setSelectedProduct(null)}>
//                 ✕
//               </button>
//             </div>
//             <div className="modal-body">
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>
//                 <div>
//                   {selectedProduct.image ? (
//                     <img
//                       src={selectedProduct.image}
//                       alt={selectedProduct.name}
//                       style={{ width: "100%", borderRadius: 15, border: "2px solid #f0f0f0" }}
//                     />
//                   ) : (
//                     <div
//                       style={{
//                         width: "100%",
//                         height: 300,
//                         background: "#f5f5f5",
//                         borderRadius: 15,
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         fontSize: 80,
//                       }}
//                     >
//                       🧴
//                     </div>
//                   )}
//                 </div>

//                 <div>
//                   <p style={{ fontSize: 12, color: "#999", marginBottom: 10, fontFamily: "monospace" }}>
//                     SKU: {selectedProduct.sku}
//                   </p>

//                   <div style={{ marginBottom: 20 }}>
//                     <span
//                       style={{
//                         background: "rgba(0, 51, 61, 0.1)",
//                         color: "#00333d",
//                         padding: "6px 12px",
//                         borderRadius: 20,
//                         fontSize: 12,
//                         fontWeight: 600,
//                       }}
//                     >
//                       {selectedProduct.category}
//                     </span>
//                   </div>

//                   <h3
//                     style={{
//                       fontSize: 16,
//                       color: "#00333d",
//                       marginBottom: 10,
//                       borderLeft: "4px solid #ff6600",
//                       paddingLeft: 10,
//                     }}
//                   >
//                     Description
//                   </h3>
//                   <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6, marginBottom: 20 }}>
//                     {selectedProduct.description || "No description available"}
//                   </p>

//                   <div
//                     style={{
//                       padding: 20,
//                       background: "#f9f9f9",
//                       borderRadius: 10,
//                       marginBottom: 20,
//                     }}
//                   >
//                     <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
//                       <span style={{ color: "#666" }}>Price:</span>
//                       <span style={{ fontSize: 24, fontWeight: 700, color: "#ff6600" }}>
//                         ₹{selectedProduct.price}
//                       </span>
//                     </div>
//                     <div style={{ display: "flex", justifyContent: "space-between" }}>
//                       <span style={{ color: "#666" }}>Stock:</span>
//                       <span style={{ fontWeight: 600, color: "#00333d" }}>
//                         {selectedProduct.stock} units
//                       </span>
//                     </div>
//                   </div>

//                   {getCartQuantity(selectedProduct.id) === 0 ? (
//                     <button
//                       style={{
//                         width: "100%",
//                         padding: 16,
//                         background: "linear-gradient(135deg, #ff6600, #ff8c00)",
//                         color: "white",
//                         border: "none",
//                         borderRadius: 10,
//                         fontWeight: 600,
//                         cursor: "pointer",
//                         fontSize: 16,
//                         boxShadow: "0 4px 15px rgba(255, 102, 0, 0.3)",
//                       }}
//                       onClick={() => handleAddToCart(selectedProduct)}
//                       disabled={selectedProduct.stock === 0}
//                     >
//                       {selectedProduct.stock === 0 ? "Out of Stock" : "Add to Cart"}
//                     </button>
//                   ) : (
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "space-between",
//                         background: "#ff6600",
//                         borderRadius: 10,
//                         padding: "6px",
//                       }}
//                     >
//                       <button
//                         aria-label="Decrease quantity"
//                         onClick={() =>
//                           updateQuantity(selectedProduct.id, getCartQuantity(selectedProduct.id) - 1)
//                         }
//                         style={{
//                           width: 44,
//                           height: 44,
//                           border: "none",
//                           background: "transparent",
//                           color: "white",
//                           fontSize: 22,
//                           fontWeight: 600,
//                           cursor: "pointer",
//                           borderRadius: 8,
//                         }}
//                       >
//                         −
//                       </button>
//                       <span style={{ color: "white", fontWeight: 600, fontSize: 17 }}>
//                         {getCartQuantity(selectedProduct.id)}
//                       </span>
//                       <button
//                         aria-label="Increase quantity"
//                         onClick={() => {
//                           const current = getCartQuantity(selectedProduct.id);
//                           if (current < selectedProduct.stock) {
//                             updateQuantity(selectedProduct.id, current + 1);
//                           }
//                         }}
//                         disabled={getCartQuantity(selectedProduct.id) >= selectedProduct.stock}
//                         style={{
//                           width: 44,
//                           height: 44,
//                           border: "none",
//                           background: "transparent",
//                           color: "white",
//                           fontSize: 22,
//                           fontWeight: 600,
//                           cursor:
//                             getCartQuantity(selectedProduct.id) >= selectedProduct.stock
//                               ? "not-allowed"
//                               : "pointer",
//                           opacity:
//                             getCartQuantity(selectedProduct.id) >= selectedProduct.stock ? 0.5 : 1,
//                           borderRadius: 8,
//                         }}
//                       >
//                         +
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Purchase;




// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { useCart } from "../context/CartContext";
// import "./Purchase.css";

// // ml sizes should only apply to items that actually come in liquid volumes.
// // Every other product gets NO size option at all (no dropdown, no "Standard" label).
// const ML_SIZE_OPTIONS = ["5ml", "10ml", "20ml", "50ml", "100ml"];

// const getSizeOptions = (product) => {
//   const name = product.name?.toLowerCase() || "";
//   if (name.includes("syringe") || name.includes("test tube")) {
//     return ML_SIZE_OPTIONS;
//   }
//   return []; // no size option for these products
// };

// const Purchase = () => {
//   const { cartItems, addToCart, removeFromCart, updateQuantity, getTotalItems, getTotalPrice } = useCart();
//   const [products, setProducts] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showCart, setShowCart] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   // tracks which size is currently chosen per product (keyed by product.id) —
//   // only relevant for products that actually have size options (Syringe / Test Tube)
//   const [selectedSizes, setSelectedSizes] = useState({});

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await fetch("/api/products");
//         const data = await response.json();
//         if (data.success) {
//           setProducts(data.products);
//         }
//       } catch (error) {
//         console.error("Error fetching products:", error);
//         alert("Failed to load products. Please refresh the page.");
//       }
//     };

//     fetchProducts();
//   }, []);

//   const filteredProducts = products.filter((product) => {
//     const productCategory = product.category?.trim().toLowerCase();
//     const selected = selectedCategory.toLowerCase();

//     const matchesCategory = selected === "all" || productCategory === selected;

//     const matchesSearch = product.name
//       ?.toLowerCase()
//       .includes(searchQuery.toLowerCase());

//     return matchesCategory && matchesSearch;
//   });

//   // Returns the currently selected size for a product, or null if the product has no size options
//   const getSelectedSize = (product) => {
//     const options = getSizeOptions(product);
//     if (options.length === 0) return null;
//     return selectedSizes[product.id] || options[0];
//   };

//   const setSize = (productId, size) => {
//     setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
//   };

//   // Build a unique cart-line id. Products with sizes get "id::size" so different
//   // sizes are tracked separately; products with no size option just use their own id.
//   const buildCartId = (productId, size) => (size ? `${productId}::${size}` : productId);

//   const handleAddToCart = (product) => {
//     const size = getSelectedSize(product);

//     if (!size) {
//       // No size options for this product — add as-is, nothing extra attached
//       addToCart(product);
//       return;
//     }

//     const cartProduct = {
//       ...product,
//       id: buildCartId(product.id, size),
//       baseProductId: product.id,
//       size: size,
//       name: `${product.name} - ${size}`,
//     };
//     addToCart(cartProduct);
//   };

//   // How many units of THIS product (+ selected size, if any) are already in the cart
//   const getCartQuantity = (product) => {
//     const size = getSelectedSize(product);
//     const cartId = buildCartId(product.id, size);
//     const item = cartItems.find((i) => i.id === cartId);
//     return item ? item.quantity : 0;
//   };

//   const cartTotal = getTotalPrice();
//   const cartCount = getTotalItems();

//   return (
//     <div className="purchase-page">
//       <div className="purchase-hero">
//         <div className="hero-content">
//           <h1>G Care Medical Equipment Store</h1>
//           <p>Quality Healthcare Products for Professionals & Individuals</p>
//           <div className="hero-stats">
//             <div className="stat-item">
//               <span className="stat-number">{products.length}</span>
//               <span className="stat-label">Products</span>
//             </div>
//             <div className="stat-item">
//               <span className="stat-number">ISO</span>
//               <span className="stat-label">Certified</span>
//             </div>
//             <div className="stat-item">
//               <span className="stat-number">24/7</span>
//               <span className="stat-label">Support</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="purchase-container">
//         <div className="filter-section">
//           <div className="search-box">
//             <input
//               type="text"
//               placeholder="🔍 Search products..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>

//           <div className="category-filters">
//             {["All", "Non-Consumable", "Consumable"].map((category) => (
//               <button
//                 key={category}
//                 className={`filter-btn ${selectedCategory === category ? "active" : ""}`}
//                 onClick={() => setSelectedCategory(category)}
//               >
//                 {category}
//               </button>
//             ))}
//           </div>

//           <button className="cart-toggle-btn" onClick={() => setShowCart(!showCart)}>
//             🛒 Cart ({cartCount})
//           </button>
//         </div>

//         <div className="products-grid">
//           {filteredProducts.length > 0 ? (
//             filteredProducts.map((product) => {
//               const qtyInCart = getCartQuantity(product);
//               const currentSize = getSelectedSize(product);
//               const sizeOptions = getSizeOptions(product);
//               const cartId = buildCartId(product.id, currentSize);

//               return (
//                 <div key={product.id} className="product-card">
//                   <div
//                     className="product-image"
//                     onClick={() => setSelectedProduct(product)}
//                     style={{ cursor: "pointer" }}
//                   >
//                     {product.image ? (
//                       <img
//                         src={product.image}
//                         alt={product.name}
//                         style={{ width: "100%", height: "100%", objectFit: "contain" }}
//                       />
//                     ) : (
//                       <span className="product-emoji">🧴</span>
//                     )}
//                     <span className="product-category-badge">{product.category}</span>
//                   </div>
//                   <div className="product-info">
//                     <h3
//                       className="product-name"
//                       onClick={() => setSelectedProduct(product)}
//                       style={{ cursor: "pointer" }}
//                     >
//                       {product.name}
//                     </h3>
//                     <p className="product-sku">SKU: {product.sku}</p>

//                     {product.description && (
//                       <p
//                         className="product-description"
//                         style={{
//                           fontSize: 13,
//                           color: "#666",
//                           marginBottom: 10,
//                           display: "-webkit-box",
//                           WebkitLineClamp: 2,
//                           WebkitBoxOrient: "vertical",
//                           overflow: "hidden",
//                         }}
//                       >
//                         {product.description}
//                       </p>
//                     )}

//                     <div className="product-footer">
//                       <div className="product-price">
//                         <span className="price-label">₹</span>
//                         <span className="price-value">{product.price}</span>
//                       </div>
//                       <div className="product-stock">
//                         Stock: <strong>{product.stock}</strong>
//                       </div>
//                     </div>

//                     {/* Size selector — only shown for products that actually have size options (Syringe / Test Tube) */}
//                     {sizeOptions.length > 0 && (
//                       <div style={{ marginBottom: 8 }}>
//                         <label
//                           style={{
//                             fontSize: 12,
//                             color: "#666",
//                             display: "block",
//                             marginBottom: 4,
//                           }}
//                         >
//                           Size
//                         </label>
//                         <select
//                           value={currentSize}
//                           onChange={(e) => setSize(product.id, e.target.value)}
//                           style={{
//                             width: "100%",
//                             padding: "8px",
//                             borderRadius: 6,
//                             border: "1px solid #ccc",
//                             fontSize: 13,
//                           }}
//                         >
//                           {sizeOptions.map((size) => (
//                             <option key={size} value={size}>
//                               {size}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     )}

//                     {qtyInCart === 0 ? (
//                       <button
//                         className="add-to-cart-btn"
//                         onClick={() => handleAddToCart(product)}
//                         disabled={product.stock === 0}
//                       >
//                         {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
//                       </button>
//                     ) : (
//                       <div
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "space-between",
//                           background: "#ff6600",
//                           borderRadius: 8,
//                           padding: "4px",
//                           marginTop: 8,
//                         }}
//                       >
//                         <button
//                           aria-label="Decrease quantity"
//                           onClick={() => updateQuantity(cartId, qtyInCart - 1)}
//                           style={{
//                             width: 36,
//                             height: 36,
//                             border: "none",
//                             background: "transparent",
//                             color: "white",
//                             fontSize: 20,
//                             fontWeight: 600,
//                             cursor: "pointer",
//                             borderRadius: 6,
//                           }}
//                         >
//                           −
//                         </button>
//                         <span style={{ color: "white", fontWeight: 600, fontSize: 15 }}>
//                           {qtyInCart}
//                         </span>
//                         <button
//                           aria-label="Increase quantity"
//                           onClick={() => {
//                             if (qtyInCart < product.stock) {
//                               updateQuantity(cartId, qtyInCart + 1);
//                             }
//                           }}
//                           disabled={qtyInCart >= product.stock}
//                           style={{
//                             width: 36,
//                             height: 36,
//                             border: "none",
//                             background: "transparent",
//                             color: "white",
//                             fontSize: 20,
//                             fontWeight: 600,
//                             cursor: qtyInCart >= product.stock ? "not-allowed" : "pointer",
//                             opacity: qtyInCart >= product.stock ? 0.5 : 1,
//                             borderRadius: 6,
//                           }}
//                         >
//                           +
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })
//           ) : (
//             <div className="no-products">
//               <p>No products found</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {showCart && (
//         <div className="cart-overlay" onClick={() => setShowCart(false)}>
//           <div className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
//             <div className="cart-header">
//               <h2>Shopping Cart ({cartCount} items)</h2>
//               <button className="close-cart-btn" onClick={() => setShowCart(false)}>
//                 ✕
//               </button>
//             </div>

//             <div className="cart-items">
//               {cartItems.length === 0 ? (
//                 <div className="empty-cart">
//                   <p>Your cart is empty</p>
//                   <span>🛒</span>
//                 </div>
//               ) : (
//                 cartItems.map((item) => (
//                   <div key={item.id} className="cart-item">
//                     {item.image ? (
//                       <img
//                         src={item.image}
//                         alt={item.name}
//                         style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }}
//                       />
//                     ) : (
//                       <span className="cart-item-emoji">🧴</span>
//                     )}
//                     <div className="cart-item-info">
//                       <h4>{item.name}</h4>
//                       <p>
//                         ₹{item.price} × {item.quantity}
//                       </p>
//                     </div>
//                     <div className="cart-item-total">₹{item.price * item.quantity}</div>
//                     <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
//                       🗑️
//                     </button>
//                   </div>
//                 ))
//               )}
//             </div>

//             {cartItems.length > 0 && (
//               <div className="cart-footer">
//                 <div className="cart-total">
//                   <span>Total:</span>
//                   <span className="total-amount">₹{cartTotal}</span>
//                 </div>
//                 <Link to="/checkout" className="checkout-btn">
//                   Proceed to Checkout
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {selectedProduct && (
//         <div
//           className="modal-overlay"
//           onClick={() => setSelectedProduct(null)}
//           style={{ zIndex: 2000 }}
//         >
//           <div
//             className="modal-content"
//             onClick={(e) => e.stopPropagation()}
//             style={{ maxWidth: 700 }}
//           >
//             <div className="modal-header">
//               <h2>{selectedProduct.name}</h2>
//               <button className="close-modal" onClick={() => setSelectedProduct(null)}>
//                 ✕
//               </button>
//             </div>
//             <div className="modal-body">
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>
//                 <div>
//                   {selectedProduct.image ? (
//                     <img
//                       src={selectedProduct.image}
//                       alt={selectedProduct.name}
//                       style={{ width: "100%", borderRadius: 15, border: "2px solid #f0f0f0" }}
//                     />
//                   ) : (
//                     <div
//                       style={{
//                         width: "100%",
//                         height: 300,
//                         background: "#f5f5f5",
//                         borderRadius: 15,
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         fontSize: 80,
//                       }}
//                     >
//                       🧴
//                     </div>
//                   )}
//                 </div>

//                 <div>
//                   <p style={{ fontSize: 12, color: "#999", marginBottom: 10, fontFamily: "monospace" }}>
//                     SKU: {selectedProduct.sku}
//                   </p>

//                   <div style={{ marginBottom: 20 }}>
//                     <span
//                       style={{
//                         background: "rgba(0, 51, 61, 0.1)",
//                         color: "#00333d",
//                         padding: "6px 12px",
//                         borderRadius: 20,
//                         fontSize: 12,
//                         fontWeight: 600,
//                       }}
//                     >
//                       {selectedProduct.category}
//                     </span>
//                   </div>

//                   <h3
//                     style={{
//                       fontSize: 16,
//                       color: "#00333d",
//                       marginBottom: 10,
//                       borderLeft: "4px solid #ff6600",
//                       paddingLeft: 10,
//                     }}
//                   >
//                     Description
//                   </h3>
//                   <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6, marginBottom: 20 }}>
//                     {selectedProduct.description || "No description available"}
//                   </p>

//                   <div
//                     style={{
//                       padding: 20,
//                       background: "#f9f9f9",
//                       borderRadius: 10,
//                       marginBottom: 20,
//                     }}
//                   >
//                     <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
//                       <span style={{ color: "#666" }}>Price:</span>
//                       <span style={{ fontSize: 24, fontWeight: 700, color: "#ff6600" }}>
//                         ₹{selectedProduct.price}
//                       </span>
//                     </div>
//                     <div style={{ display: "flex", justifyContent: "space-between" }}>
//                       <span style={{ color: "#666" }}>Stock:</span>
//                       <span style={{ fontWeight: 600, color: "#00333d" }}>
//                         {selectedProduct.stock} units
//                       </span>
//                     </div>
//                   </div>

//                   {/* Size selector in modal — only shown for products that actually have size options */}
//                   {getSizeOptions(selectedProduct).length > 0 && (
//                     <div style={{ marginBottom: 16 }}>
//                       <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 6 }}>
//                         Size
//                       </label>
//                       <select
//                         value={getSelectedSize(selectedProduct)}
//                         onChange={(e) => setSize(selectedProduct.id, e.target.value)}
//                         style={{
//                           width: "100%",
//                           padding: "10px",
//                           borderRadius: 8,
//                           border: "1px solid #ccc",
//                           fontSize: 14,
//                         }}
//                       >
//                         {getSizeOptions(selectedProduct).map((size) => (
//                           <option key={size} value={size}>
//                             {size}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   )}

//                   {getCartQuantity(selectedProduct) === 0 ? (
//                     <button
//                       style={{
//                         width: "100%",
//                         padding: 16,
//                         background: "linear-gradient(135deg, #ff6600, #ff8c00)",
//                         color: "white",
//                         border: "none",
//                         borderRadius: 10,
//                         fontWeight: 600,
//                         cursor: "pointer",
//                         fontSize: 16,
//                         boxShadow: "0 4px 15px rgba(255, 102, 0, 0.3)",
//                       }}
//                       onClick={() => handleAddToCart(selectedProduct)}
//                       disabled={selectedProduct.stock === 0}
//                     >
//                       {selectedProduct.stock === 0 ? "Out of Stock" : "Add to Cart"}
//                     </button>
//                   ) : (
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "space-between",
//                         background: "#ff6600",
//                         borderRadius: 10,
//                         padding: "6px",
//                       }}
//                     >
//                       <button
//                         aria-label="Decrease quantity"
//                         onClick={() =>
//                           updateQuantity(
//                             buildCartId(selectedProduct.id, getSelectedSize(selectedProduct)),
//                             getCartQuantity(selectedProduct) - 1
//                           )
//                         }
//                         style={{
//                           width: 44,
//                           height: 44,
//                           border: "none",
//                           background: "transparent",
//                           color: "white",
//                           fontSize: 22,
//                           fontWeight: 600,
//                           cursor: "pointer",
//                           borderRadius: 8,
//                         }}
//                       >
//                         −
//                       </button>
//                       <span style={{ color: "white", fontWeight: 600, fontSize: 17 }}>
//                         {getCartQuantity(selectedProduct)}
//                       </span>
//                       <button
//                         aria-label="Increase quantity"
//                         onClick={() => {
//                           const current = getCartQuantity(selectedProduct);
//                           if (current < selectedProduct.stock) {
//                             updateQuantity(
//                               buildCartId(selectedProduct.id, getSelectedSize(selectedProduct)),
//                               current + 1
//                             );
//                           }
//                         }}
//                         disabled={getCartQuantity(selectedProduct) >= selectedProduct.stock}
//                         style={{
//                           width: 44,
//                           height: 44,
//                           border: "none",
//                           background: "transparent",
//                           color: "white",
//                           fontSize: 22,
//                           fontWeight: 600,
//                           cursor:
//                             getCartQuantity(selectedProduct) >= selectedProduct.stock
//                               ? "not-allowed"
//                               : "pointer",
//                           opacity:
//                             getCartQuantity(selectedProduct) >= selectedProduct.stock ? 0.5 : 1,
//                           borderRadius: 8,
//                         }}
//                       >
//                         +
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Purchase;





// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { useCart } from "../context/CartContext";
// import "./Purchase.css";

// // ml sizes for products sold by volume
// const ML_SIZE_OPTIONS = ["2ml", "3ml", "5ml", "10ml"];

// // Test Tube also comes in different cap colors — edit this list to match your actual stock colors
// const TEST_TUBE_COLORS = ["Green", "Black", "Purple", "Red", "Gray", "Sky Blue"];

// // Returns the option config for a given product:
// // { ml: [...] }               -> Syringe (actual syringe, not the destroyer machine): only ml dropdown
// // { ml: [...], color: [...] } -> Test Tube (the actual tube, NOT the stand): both ml + color dropdowns
// // {}                          -> everything else (including Test Tube Stand, Syringe Destroyer): no options at all
// const getProductOptions = (product) => {
//   const name = product.name?.toLowerCase() || "";

//   // "Test Tube Stand" contains "test tube" too, so explicitly exclude anything with "stand"
//   const isActualTestTube = name.includes("test tube") && !name.includes("stand");

//   // "Syringe Destroyer" contains "syringe" too, so explicitly exclude anything with "destroyer"
//   const isActualSyringe = name.includes("syringe") && !name.includes("destroyer");

//   if (isActualTestTube) {
//     return { color: TEST_TUBE_COLORS };
//   }
//   if (isActualSyringe) {
//     return { ml: ML_SIZE_OPTIONS };
//   }
//   return {};
// };

// const Purchase = () => {
//   const { cartItems, addToCart, removeFromCart, updateQuantity, getTotalItems, getTotalPrice } = useCart();
//   const [products, setProducts] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showCart, setShowCart] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   // tracks chosen ml per product id, e.g. { productId: "10ml" }
//   const [selectedMl, setSelectedMl] = useState({});
//   // tracks chosen color per product id, e.g. { productId: "Green" }
//   const [selectedColor, setSelectedColor] = useState({});

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await fetch("/api/products");
//         const data = await response.json();
//         if (data.success) {
//           setProducts(data.products);
//         }
//       } catch (error) {
//         console.error("Error fetching products:", error);
//         alert("Failed to load products. Please refresh the page.");
//       }
//     };

//     fetchProducts();
//   }, []);

//   const filteredProducts = products.filter((product) => {
//     const productCategory = product.category?.trim().toLowerCase();
//     const selected = selectedCategory.toLowerCase();

//     const matchesCategory = selected === "all" || productCategory === selected;

//     const matchesSearch = product.name
//       ?.toLowerCase()
//       .includes(searchQuery.toLowerCase());

//     return matchesCategory && matchesSearch;
//   });

//   // Currently chosen ml for a product, or null if this product has no ml option
//   const getSelectedMl = (product) => {
//     const { ml } = getProductOptions(product);
//     if (!ml) return null;
//     return selectedMl[product.id] || ml[0];
//   };

//   // Currently chosen color for a product, or null if this product has no color option
//   const getSelectedColor = (product) => {
//     const { color } = getProductOptions(product);
//     if (!color) return null;
//     return selectedColor[product.id] || color[0];
//   };

//   const setMl = (productId, ml) => {
//     setSelectedMl((prev) => ({ ...prev, [productId]: ml }));
//   };

//   const setColor = (productId, color) => {
//     setSelectedColor((prev) => ({ ...prev, [productId]: color }));
//   };

//   // Build a unique cart-line id from whichever options apply to this product.
//   // e.g. "12::10ml::Green", "45::20ml" (syringe), or just "9" (no options)
//   const buildCartId = (productId, ml, color) => {
//     let id = `${productId}`;
//     if (ml) id += `::${ml}`;
//     if (color) id += `::${color}`;
//     return id;
//   };

//   const handleAddToCart = (product) => {
//     const ml = getSelectedMl(product);
//     const color = getSelectedColor(product);

//     if (!ml && !color) {
//       // No options for this product — add as-is
//       addToCart(product);
//       return;
//     }

//     const labelParts = [];
//     if (ml) labelParts.push(ml);
//     if (color) labelParts.push(color);

//     const cartProduct = {
//       ...product,
//       id: buildCartId(product.id, ml, color),
//       baseProductId: product.id,
//       ml: ml || undefined,
//       color: color || undefined,
//       name: `${product.name} - ${labelParts.join(" / ")}`,
//     };
//     addToCart(cartProduct);
//   };

//   // How many units of THIS product (+ selected ml/color, if any) are already in the cart
//   const getCartQuantity = (product) => {
//     const ml = getSelectedMl(product);
//     const color = getSelectedColor(product);
//     const cartId = buildCartId(product.id, ml, color);
//     const item = cartItems.find((i) => i.id === cartId);
//     return item ? item.quantity : 0;
//   };

//   const cartTotal = getTotalPrice();
//   const cartCount = getTotalItems();

//   return (
//     <div className="purchase-page">
//       <div className="purchase-hero">
//         <div className="hero-content">
//           <h1>G Care Medical Equipment Store</h1>
//           <p>Quality Healthcare Products for Professionals & Individuals</p>
//           <div className="hero-stats">
//             <div className="stat-item">
//               <span className="stat-number">{products.length}</span>
//               <span className="stat-label">Products</span>
//             </div>
//             <div className="stat-item">
//               <span className="stat-number">ISO</span>
//               <span className="stat-label">Certified</span>
//             </div>
//             <div className="stat-item">
//               <span className="stat-number">24/7</span>
//               <span className="stat-label">Support</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="purchase-container">
//         <div className="filter-section">
//           <div className="search-box">
//             <input
//               type="text"
//               placeholder="🔍 Search products..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>

//           <div className="category-filters">
//             {["All", "Non-Consumable", "Consumable"].map((category) => (
//               <button
//                 key={category}
//                 className={`filter-btn ${selectedCategory === category ? "active" : ""}`}
//                 onClick={() => setSelectedCategory(category)}
//               >
//                 {category}
//               </button>
//             ))}
//           </div>

//           <button className="cart-toggle-btn" onClick={() => setShowCart(!showCart)}>
//             🛒 Cart ({cartCount})
//           </button>
//         </div>

//         <div className="products-grid">
//           {filteredProducts.length > 0 ? (
//             filteredProducts.map((product) => {
//               const qtyInCart = getCartQuantity(product);
//               const currentMl = getSelectedMl(product);
//               const currentColor = getSelectedColor(product);
//               const { ml: mlOptions, color: colorOptions } = getProductOptions(product);
//               const cartId = buildCartId(product.id, currentMl, currentColor);

//               return (
//                 <div key={product.id} className="product-card">
//                   <div
//                     className="product-image"
//                     onClick={() => setSelectedProduct(product)}
//                     style={{ cursor: "pointer" }}
//                   >
//                     {product.image ? (
//                       <img
//                         src={product.image}
//                         alt={product.name}
//                         style={{ width: "100%", height: "100%", objectFit: "contain" }}
//                       />
//                     ) : (
//                       <span className="product-emoji">🧴</span>
//                     )}
//                     <span className="product-category-badge">{product.category}</span>
//                   </div>
//                   <div className="product-info">
//                     <h3
//                       className="product-name"
//                       onClick={() => setSelectedProduct(product)}
//                       style={{ cursor: "pointer" }}
//                     >
//                       {product.name}
//                     </h3>
//                     <p className="product-sku">SKU: {product.sku}</p>

//                     {product.description && (
//                       <p
//                         className="product-description"
//                         style={{
//                           fontSize: 13,
//                           color: "#666",
//                           marginBottom: 10,
//                           display: "-webkit-box",
//                           WebkitLineClamp: 2,
//                           WebkitBoxOrient: "vertical",
//                           overflow: "hidden",
//                         }}
//                       >
//                         {product.description}
//                       </p>
//                     )}

//                     <div className="product-footer">
//                       <div className="product-price">
//                         <span className="price-label">₹</span>
//                         <span className="price-value">{product.price}</span>
//                       </div>
//                       <div className="product-stock">
//                         Stock: <strong>{product.stock}</strong>
//                       </div>
//                     </div>

//                     {/* ml dropdown — actual Syringe only (not Test Tube, not Syringe Destroyer) */}
//                     {mlOptions && (
//                       <div style={{ marginBottom: 8 }}>
//                         <label style={{ fontSize: 12, color: "#666", display: "block", marginBottom: 4 }}>
//                           Size (ml)
//                         </label>
//                         <select
//                           value={currentMl}
//                           onChange={(e) => setMl(product.id, e.target.value)}
//                           style={{
//                             width: "100%",
//                             padding: "8px",
//                             borderRadius: 6,
//                             border: "1px solid #ccc",
//                             fontSize: 13,
//                           }}
//                         >
//                           {mlOptions.map((size) => (
//                             <option key={size} value={size}>
//                               {size}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     )}

//                     {/* Color dropdown — Test Tube only */}
//                     {colorOptions && (
//                       <div style={{ marginBottom: 8 }}>
//                         <label style={{ fontSize: 12, color: "#666", display: "block", marginBottom: 4 }}>
//                           Color
//                         </label>
//                         <select
//                           value={currentColor}
//                           onChange={(e) => setColor(product.id, e.target.value)}
//                           style={{
//                             width: "100%",
//                             padding: "8px",
//                             borderRadius: 6,
//                             border: "1px solid #ccc",
//                             fontSize: 13,
//                           }}
//                         >
//                           {colorOptions.map((c) => (
//                             <option key={c} value={c}>
//                               {c}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     )}

//                     {qtyInCart === 0 ? (
//                       <button
//                         className="add-to-cart-btn"
//                         onClick={() => handleAddToCart(product)}
//                         disabled={product.stock === 0}
//                       >
//                         {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
//                       </button>
//                     ) : (
//                       <div
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "space-between",
//                           background: "#ff6600",
//                           borderRadius: 8,
//                           padding: "4px",
//                           marginTop: 8,
//                         }}
//                       >
//                         <button
//                           aria-label="Decrease quantity"
//                           onClick={() => updateQuantity(cartId, qtyInCart - 1)}
//                           style={{
//                             width: 36,
//                             height: 36,
//                             border: "none",
//                             background: "transparent",
//                             color: "white",
//                             fontSize: 20,
//                             fontWeight: 600,
//                             cursor: "pointer",
//                             borderRadius: 6,
//                           }}
//                         >
//                           −
//                         </button>
//                         <span style={{ color: "white", fontWeight: 600, fontSize: 15 }}>
//                           {qtyInCart}
//                         </span>
//                         <button
//                           aria-label="Increase quantity"
//                           onClick={() => {
//                             if (qtyInCart < product.stock) {
//                               updateQuantity(cartId, qtyInCart + 1);
//                             }
//                           }}
//                           disabled={qtyInCart >= product.stock}
//                           style={{
//                             width: 36,
//                             height: 36,
//                             border: "none",
//                             background: "transparent",
//                             color: "white",
//                             fontSize: 20,
//                             fontWeight: 600,
//                             cursor: qtyInCart >= product.stock ? "not-allowed" : "pointer",
//                             opacity: qtyInCart >= product.stock ? 0.5 : 1,
//                             borderRadius: 6,
//                           }}
//                         >
//                           +
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })
//           ) : (
//             <div className="no-products">
//               <p>No products found</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {showCart && (
//         <div className="cart-overlay" onClick={() => setShowCart(false)}>
//           <div className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
//             <div className="cart-header">
//               <h2>Shopping Cart ({cartCount} items)</h2>
//               <button className="close-cart-btn" onClick={() => setShowCart(false)}>
//                 ✕
//               </button>
//             </div>

//             <div className="cart-items">
//               {cartItems.length === 0 ? (
//                 <div className="empty-cart">
//                   <p>Your cart is empty</p>
//                   <span>🛒</span>
//                 </div>
//               ) : (
//                 cartItems.map((item) => (
//                   <div key={item.id} className="cart-item">
//                     {item.image ? (
//                       <img
//                         src={item.image}
//                         alt={item.name}
//                         style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }}
//                       />
//                     ) : (
//                       <span className="cart-item-emoji">🧴</span>
//                     )}
//                     <div className="cart-item-info">
//                       <h4>{item.name}</h4>
//                       <p>
//                         ₹{item.price} × {item.quantity}
//                       </p>
//                     </div>
//                     <div className="cart-item-total">₹{item.price * item.quantity}</div>
//                     <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
//                       🗑️
//                     </button>
//                   </div>
//                 ))
//               )}
//             </div>

//             {cartItems.length > 0 && (
//               <div className="cart-footer">
//                 <div className="cart-total">
//                   <span>Total:</span>
//                   <span className="total-amount">₹{cartTotal}</span>
//                 </div>
//                 <Link to="/checkout" className="checkout-btn">
//                   Proceed to Checkout
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {selectedProduct && (
//         <div
//           className="modal-overlay"
//           onClick={() => setSelectedProduct(null)}
//           style={{ zIndex: 2000 }}
//         >
//           <div
//             className="modal-content"
//             onClick={(e) => e.stopPropagation()}
//             style={{ maxWidth: 700 }}
//           >
//             <div className="modal-header">
//               <h2>{selectedProduct.name}</h2>
//               <button className="close-modal" onClick={() => setSelectedProduct(null)}>
//                 ✕
//               </button>
//             </div>
//             <div className="modal-body">
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>
//                 <div>
//                   {selectedProduct.image ? (
//                     <img
//                       src={selectedProduct.image}
//                       alt={selectedProduct.name}
//                       style={{ width: "100%", borderRadius: 15, border: "2px solid #f0f0f0" }}
//                     />
//                   ) : (
//                     <div
//                       style={{
//                         width: "100%",
//                         height: 300,
//                         background: "#f5f5f5",
//                         borderRadius: 15,
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         fontSize: 80,
//                       }}
//                     >
//                       🧴
//                     </div>
//                   )}
//                 </div>

//                 <div>
//                   <p style={{ fontSize: 12, color: "#999", marginBottom: 10, fontFamily: "monospace" }}>
//                     SKU: {selectedProduct.sku}
//                   </p>

//                   <div style={{ marginBottom: 20 }}>
//                     <span
//                       style={{
//                         background: "rgba(0, 51, 61, 0.1)",
//                         color: "#00333d",
//                         padding: "6px 12px",
//                         borderRadius: 20,
//                         fontSize: 12,
//                         fontWeight: 600,
//                       }}
//                     >
//                       {selectedProduct.category}
//                     </span>
//                   </div>

//                   <h3
//                     style={{
//                       fontSize: 16,
//                       color: "#00333d",
//                       marginBottom: 10,
//                       borderLeft: "4px solid #ff6600",
//                       paddingLeft: 10,
//                     }}
//                   >
//                     Description
//                   </h3>
//                   <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6, marginBottom: 20 }}>
//                     {selectedProduct.description || "No description available"}
//                   </p>

//                   <div
//                     style={{
//                       padding: 20,
//                       background: "#f9f9f9",
//                       borderRadius: 10,
//                       marginBottom: 20,
//                     }}
//                   >
//                     <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
//                       <span style={{ color: "#666" }}>Price:</span>
//                       <span style={{ fontSize: 24, fontWeight: 700, color: "#ff6600" }}>
//                         ₹{selectedProduct.price}
//                       </span>
//                     </div>
//                     <div style={{ display: "flex", justifyContent: "space-between" }}>
//                       <span style={{ color: "#666" }}>Stock:</span>
//                       <span style={{ fontWeight: 600, color: "#00333d" }}>
//                         {selectedProduct.stock} units
//                       </span>
//                     </div>
//                   </div>

//                   {/* ml dropdown in modal — actual Syringe only */}
//                   {getProductOptions(selectedProduct).ml && (
//                     <div style={{ marginBottom: 16 }}>
//                       <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 6 }}>
//                         Size (ml)
//                       </label>
//                       <select
//                         value={getSelectedMl(selectedProduct)}
//                         onChange={(e) => setMl(selectedProduct.id, e.target.value)}
//                         style={{
//                           width: "100%",
//                           padding: "10px",
//                           borderRadius: 8,
//                           border: "1px solid #ccc",
//                           fontSize: 14,
//                         }}
//                       >
//                         {getProductOptions(selectedProduct).ml.map((size) => (
//                           <option key={size} value={size}>
//                             {size}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   )}

//                   {/* Color dropdown in modal — Test Tube only */}
//                   {getProductOptions(selectedProduct).color && (
//                     <div style={{ marginBottom: 16 }}>
//                       <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 6 }}>
//                         Color
//                       </label>
//                       <select
//                         value={getSelectedColor(selectedProduct)}
//                         onChange={(e) => setColor(selectedProduct.id, e.target.value)}
//                         style={{
//                           width: "100%",
//                           padding: "10px",
//                           borderRadius: 8,
//                           border: "1px solid #ccc",
//                           fontSize: 14,
//                         }}
//                       >
//                         {getProductOptions(selectedProduct).color.map((c) => (
//                           <option key={c} value={c}>
//                             {c}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   )}

//                   {getCartQuantity(selectedProduct) === 0 ? (
//                     <button
//                       style={{
//                         width: "100%",
//                         padding: 16,
//                         background: "linear-gradient(135deg, #ff6600, #ff8c00)",
//                         color: "white",
//                         border: "none",
//                         borderRadius: 10,
//                         fontWeight: 600,
//                         cursor: "pointer",
//                         fontSize: 16,
//                         boxShadow: "0 4px 15px rgba(255, 102, 0, 0.3)",
//                       }}
//                       onClick={() => handleAddToCart(selectedProduct)}
//                       disabled={selectedProduct.stock === 0}
//                     >
//                       {selectedProduct.stock === 0 ? "Out of Stock" : "Add to Cart"}
//                     </button>
//                   ) : (
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "space-between",
//                         background: "#ff6600",
//                         borderRadius: 10,
//                         padding: "6px",
//                       }}
//                     >
//                       <button
//                         aria-label="Decrease quantity"
//                         onClick={() =>
//                           updateQuantity(
//                             buildCartId(
//                               selectedProduct.id,
//                               getSelectedMl(selectedProduct),
//                               getSelectedColor(selectedProduct)
//                             ),
//                             getCartQuantity(selectedProduct) - 1
//                           )
//                         }
//                         style={{
//                           width: 44,
//                           height: 44,
//                           border: "none",
//                           background: "transparent",
//                           color: "white",
//                           fontSize: 22,
//                           fontWeight: 600,
//                           cursor: "pointer",
//                           borderRadius: 8,
//                         }}
//                       >
//                         −
//                       </button>
//                       <span style={{ color: "white", fontWeight: 600, fontSize: 17 }}>
//                         {getCartQuantity(selectedProduct)}
//                       </span>
//                       <button
//                         aria-label="Increase quantity"
//                         onClick={() => {
//                           const current = getCartQuantity(selectedProduct);
//                           if (current < selectedProduct.stock) {
//                             updateQuantity(
//                               buildCartId(
//                                 selectedProduct.id,
//                                 getSelectedMl(selectedProduct),
//                                 getSelectedColor(selectedProduct)
//                               ),
//                               current + 1
//                             );
//                           }
//                         }}
//                         disabled={getCartQuantity(selectedProduct) >= selectedProduct.stock}
//                         style={{
//                           width: 44,
//                           height: 44,
//                           border: "none",
//                           background: "transparent",
//                           color: "white",
//                           fontSize: 22,
//                           fontWeight: 600,
//                           cursor:
//                             getCartQuantity(selectedProduct) >= selectedProduct.stock
//                               ? "not-allowed"
//                               : "pointer",
//                           opacity:
//                             getCartQuantity(selectedProduct) >= selectedProduct.stock ? 0.5 : 1,
//                           borderRadius: 8,
//                         }}
//                       >
//                         +
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Purchase;







import React, { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Purchase.css";
import {
  FaSearch,
  FaTimes,
  FaShoppingCart,
  FaShoppingBag,
  FaBolt,
  FaExpand,
  FaTrashAlt,
  FaMinus,
  FaPlus,
  FaArrowRight,
  FaCheckCircle,
  FaShieldAlt,
  FaHeadset,
  FaBoxOpen,
  FaExclamationTriangle,
} from "react-icons/fa";

// ml sizes for products sold by volume
const ML_SIZE_OPTIONS = ["2ml", "3ml", "5ml", "10ml"];

// ✅ NEW: price for each Syringe ml size — edit these numbers if prices change
const SYRINGE_ML_PRICES = {
  "2ml": 50,
  "3ml": 65,
  "5ml": 75,
  "10ml": 100,
};

// Test Tube also comes in different cap colors — edit this list to match your actual stock colors
const TEST_TUBE_COLORS = ["Green", "Black", "Purple", "Red", "Gray", "Sky Blue"];

// swatch colours for the Test Tube colour picker (display only)
const COLOR_SWATCH = {
  Green: "#22c55e",
  Black: "#111827",
  Purple: "#a855f7",
  Red: "#ef4444",
  Gray: "#9ca3af",
  "Sky Blue": "#38bdf8",
};

// Returns the option config for a given product:
// { ml: [...] }               -> Syringe (actual syringe, not the destroyer machine): only ml dropdown
// { ml: [...], color: [...] } -> Test Tube (the actual tube, NOT the stand): both ml + color dropdowns
// {}                          -> everything else (including Test Tube Stand, Syringe Destroyer): no options at all
const getProductOptions = (product) => {
  const name = product.name?.toLowerCase() || "";

  // "Test Tube Stand" contains "test tube" too, so explicitly exclude anything with "stand"
  const isActualTestTube = name.includes("test tube") && !name.includes("stand");

  // "Syringe Destroyer" contains "syringe" too, so explicitly exclude anything with "destroyer"
  const isActualSyringe = name.includes("syringe") && !name.includes("destroyer");

  if (isActualTestTube) {
    return { color: TEST_TUBE_COLORS };
  }
  if (isActualSyringe) {
    return { ml: ML_SIZE_OPTIONS, isSyringe: true };
  }
  return {};
};

const CATEGORIES = ["All", "Non-Consumable", "Consumable"];
const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "name", label: "Name A–Z" },
];

const stockInfo = (stock) => {
  if (stock === 0) return { key: "out", label: "Out of stock" };
  if (stock <= 5) return { key: "low", label: `Only ${stock} left` };
  return { key: "in", label: "In stock" };
};

// Product image that falls back to the placeholder if the file is missing
const ProductImage = ({ src, alt, fallbackClass = "shop-card-emoji" }) => {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  if (!src || failed) return <span className={fallbackClass} aria-hidden="true">🧴</span>;
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />;
};

const Purchase = () => {
  const { cartItems, addToCart, removeFromCart, updateQuantity, getTotalItems, getTotalPrice } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortBy, setSortBy] = useState("featured"); // UI only
  const [toast, setToast] = useState(null); // UI only
  const gridRef = useRef(null);

  // tracks chosen ml per product id, e.g. { productId: "10ml" }
  const [selectedMl, setSelectedMl] = useState({});
  // tracks chosen color per product id, e.g. { productId: "Green" }
  const [selectedColor, setSelectedColor] = useState({});

  // "loading" | "ready" | "error" — lets the UI tell "no products exist" apart
  // from "the API call failed", instead of silently showing a zero count.
  const [loadState, setLoadState] = useState("loading");
  const [loadError, setLoadError] = useState("");

  const fetchProducts = async () => {
    setLoadState("loading");
    setLoadError("");
    try {
      const response = await fetch("/api/products");
      const data = await response.json().catch(() => ({}));

      // Log the raw response so a backend failure is visible in the console
      console.log("📦 /api/products →", response.status, data);

      if (!response.ok || !data.success || !Array.isArray(data.products)) {
        throw new Error(
          data.message || data.error || `Server responded with HTTP ${response.status}`
        );
      }

      setProducts(data.products);
      setLoadState("ready");
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      setLoadError(error.message);
      setLoadState("error");
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredProducts = products.filter((product) => {
    const productCategory = product.category?.trim().toLowerCase();
    const selected = selectedCategory.toLowerCase();

    const matchesCategory = selected === "all" || productCategory === selected;

    const matchesSearch = product.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Currently chosen ml for a product, or null if this product has no ml option
  const getSelectedMl = (product) => {
    const { ml } = getProductOptions(product);
    if (!ml) return null;
    return selectedMl[product.id] || ml[0];
  };

  // Currently chosen color for a product, or null if this product has no color option
  const getSelectedColor = (product) => {
    const { color } = getProductOptions(product);
    if (!color) return null;
    return selectedColor[product.id] || color[0];
  };

  const setMl = (productId, ml) => {
    setSelectedMl((prev) => ({ ...prev, [productId]: ml }));
  };

  const setColor = (productId, color) => {
    setSelectedColor((prev) => ({ ...prev, [productId]: color }));
  };

  // ✅ NEW: The price to actually charge/display for this product, given the
  // currently selected options. For syringes, this looks up SYRINGE_ML_PRICES
  // by the selected ml size. Everything else just uses the base product price.
  const getDisplayPrice = (product) => {
    const { isSyringe } = getProductOptions(product);
    if (isSyringe) {
      const ml = getSelectedMl(product);
      return SYRINGE_ML_PRICES[ml] ?? product.price;
    }
    return product.price;
  };

  // Build a unique cart-line id from whichever options apply to this product.
  // e.g. "12::10ml::Green", "45::20ml" (syringe), or just "9" (no options)
  const buildCartId = (productId, ml, color) => {
    let id = `${productId}`;
    if (ml) id += `::${ml}`;
    if (color) id += `::${color}`;
    return id;
  };

  const handleAddToCart = (product) => {
    const ml = getSelectedMl(product);
    const color = getSelectedColor(product);

    if (!ml && !color) {
      // No options for this product — add as-is
      addToCart(product);
      showToast(product.name);
      return;
    }

    const labelParts = [];
    if (ml) labelParts.push(ml);
    if (color) labelParts.push(color);

    const cartProduct = {
      ...product,
      id: buildCartId(product.id, ml, color),
      baseProductId: product.id,
      ml: ml || undefined,
      color: color || undefined,
      price: getDisplayPrice(product), // ✅ use the size-specific price in the cart
      name: `${product.name} - ${labelParts.join(" / ")}`,
    };
    addToCart(cartProduct);
    showToast(cartProduct.name);
  };

  // Buy Now = make sure the item is in the cart, then go straight to checkout
  const handleBuyNow = (product) => {
    if (getCartQuantity(product) === 0) handleAddToCart(product);
    setSelectedProduct(null);
    navigate("/checkout");
  };

  // How many units of THIS product (+ selected ml/color, if any) are already in the cart
  const getCartQuantity = (product) => {
    const ml = getSelectedMl(product);
    const color = getSelectedColor(product);
    const cartId = buildCartId(product.id, ml, color);
    const item = cartItems.find((i) => i.id === cartId);
    return item ? item.quantity : 0;
  };

  const showToast = (name) => {
    setToast({ name, key: Date.now() });
  };
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  // sorting is presentation only — the filtered list itself is unchanged
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === "price-asc") list.sort((a, b) => getDisplayPrice(a) - getDisplayPrice(b));
    else if (sortBy === "price-desc") list.sort((a, b) => getDisplayPrice(b) - getDisplayPrice(a));
    else if (sortBy === "name") list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredProducts, sortBy, selectedMl]);

  const categoryCount = (cat) =>
    cat === "All"
      ? products.length
      : products.filter((p) => p.category?.trim().toLowerCase() === cat.toLowerCase()).length;

  // scroll reveal for product cards
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll(".shop-card"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      cards.forEach((c) => (c.dataset.visible = "1"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.dataset.visible = "1";
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.1 }
    );
    cards.forEach((c) => io.observe(c));
    const fallback = setTimeout(() => cards.forEach((c) => (c.dataset.visible = "1")), 1500);
    return () => {
      io.disconnect();
      clearTimeout(fallback);
    };
  }, [sortedProducts]);

  // lock scroll + Esc for cart drawer / product modal
  useEffect(() => {
    const open = showCart || Boolean(selectedProduct);
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") {
        setShowCart(false);
        setSelectedProduct(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [showCart, selectedProduct]);

  const cartTotal = getTotalPrice();
  const cartCount = getTotalItems();

  /* ---------- shared option pickers (card + modal) ---------- */
  const renderOptions = (product, size = "sm") => {
    const { ml: mlOptions, color: colorOptions } = getProductOptions(product);
    const currentMl = getSelectedMl(product);
    const currentColor = getSelectedColor(product);
    if (!mlOptions && !colorOptions) return null;
    return (
      <div className={`shop-options shop-options--${size}`}>
        {mlOptions && (
          <div className="shop-option">
            <span className="shop-option-label">Size (ml)</span>
            <div className="shop-pills" role="radiogroup" aria-label="Size">
              {mlOptions.map((s) => (
                <button
                  type="button"
                  key={s}
                  role="radio"
                  aria-checked={currentMl === s}
                  className={`shop-pill${currentMl === s ? " is-active" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMl(product.id, s);
                  }}
                >
                  {s} <small>₹{SYRINGE_ML_PRICES[s]}</small>
                </button>
              ))}
            </div>
          </div>
        )}
        {colorOptions && (
          <div className="shop-option">
            <span className="shop-option-label">
              Color · <strong>{currentColor}</strong>
            </span>
            <div className="shop-swatches" role="radiogroup" aria-label="Color">
              {colorOptions.map((c) => (
                <button
                  type="button"
                  key={c}
                  role="radio"
                  aria-checked={currentColor === c}
                  aria-label={c}
                  title={c}
                  className={`shop-swatch${currentColor === c ? " is-active" : ""}`}
                  style={{ "--swatch": COLOR_SWATCH[c] || "#999" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setColor(product.id, c);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  /* ---------- add / buy / quantity controls (card + modal) ---------- */
  const renderActions = (product, size = "sm") => {
    const qtyInCart = getCartQuantity(product);
    const cartId = buildCartId(product.id, getSelectedMl(product), getSelectedColor(product));
    const out = product.stock === 0;

    return (
      <div className={`shop-actions shop-actions--${size}`}>
        {qtyInCart === 0 ? (
          <button
            type="button"
            className="shop-btn shop-btn--cart"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(product);
            }}
            disabled={out}
          >
            <FaShoppingCart /> {out ? "Out of Stock" : "Add to Cart"}
          </button>
        ) : (
          <div className="shop-qty" aria-label="Quantity in cart">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={(e) => {
                e.stopPropagation();
                updateQuantity(cartId, qtyInCart - 1);
              }}
            >
              <FaMinus />
            </button>
            <span>{qtyInCart}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={qtyInCart >= product.stock}
              onClick={(e) => {
                e.stopPropagation();
                if (qtyInCart < product.stock) updateQuantity(cartId, qtyInCart + 1);
              }}
            >
              <FaPlus />
            </button>
          </div>
        )}
        <button
          type="button"
          className="shop-btn shop-btn--buy"
          onClick={(e) => {
            e.stopPropagation();
            handleBuyNow(product);
          }}
          disabled={out}
        >
          <FaBolt /> Buy Now
        </button>
      </div>
    );
  };

  return (
    <div className="purchase-page shop">
      {/* ================= HERO ================= */}
      <section className="shop-hero">
        <div className="shop-hero-grid" aria-hidden="true" />
        <div className="shop-orb shop-orb--a" aria-hidden="true" />
        <div className="shop-orb shop-orb--b" aria-hidden="true" />
        <div className="shop-hero-inner">
          <span className="shop-eyebrow">G Care · Medical supplies</span>
          <h1>G Care Medical Equipment Store</h1>
          <p>Quality Healthcare Products for Professionals &amp; Individuals</p>
          <div className="shop-stats">
            <div className="shop-stat">
              <span className="shop-stat-icon"><FaBoxOpen /></span>
              <div>
                <strong>{products.length}</strong>
                <small>Products</small>
              </div>
            </div>
            <div className="shop-stat">
              <span className="shop-stat-icon shop-stat-icon--green"><FaShieldAlt /></span>
              <div>
                <strong>ISO</strong>
                <small>Certified</small>
              </div>
            </div>
            <div className="shop-stat">
              <span className="shop-stat-icon shop-stat-icon--violet"><FaHeadset /></span>
              <div>
                <strong>24/7</strong>
                <small>Support</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TOOLBAR ================= */}
      <div className="shop-toolbar">
        <div className="shop-toolbar-inner">
          <label className="shop-search">
            <FaSearch className="shop-search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search products"
            />
            {searchQuery && (
              <button type="button" className="shop-search-clear" onClick={() => setSearchQuery("")} aria-label="Clear search">
                <FaTimes />
              </button>
            )}
          </label>

          <div className="shop-filters" role="tablist" aria-label="Category">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={selectedCategory === category}
                className={`shop-filter${selectedCategory === category ? " is-active" : ""}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
                {loadState === "ready" && <span className="shop-filter-count">{categoryCount(category)}</span>}
              </button>
            ))}
          </div>

          <label className="shop-sort">
            <span>Sort</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort products">
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </label>

          <button type="button" className="shop-cart-btn" onClick={() => setShowCart(!showCart)} aria-label={`Open cart, ${cartCount} items`}>
            <span className="shop-cart-btn-icon">
              <FaShoppingCart />
              {cartCount > 0 && <span className="shop-cart-badge">{cartCount}</span>}
            </span>
            <span className="shop-cart-btn-text">
              <small>Cart</small>
              <strong>₹{cartTotal}</strong>
            </span>
          </button>
        </div>
      </div>

      {/* ================= PRODUCTS ================= */}
      <div className="purchase-container shop-container">
        <div className="shop-results">
          {loadState === "ready" && (
            <span>
              Showing <strong>{sortedProducts.length}</strong> of {products.length} products
              {searchQuery && <> for “{searchQuery}”</>}
            </span>
          )}
        </div>

        {loadState === "loading" ? (
          <div className="shop-grid" aria-busy="true">
            {Array.from({ length: 8 }).map((_, i) => (
              <div className="shop-skeleton" key={i} style={{ "--i": i }}>
                <div className="shop-skeleton-img" />
                <div className="shop-skeleton-line" />
                <div className="shop-skeleton-line shop-skeleton-line--short" />
                <div className="shop-skeleton-btn" />
              </div>
            ))}
          </div>
        ) : loadState === "error" ? (
          <div className="shop-empty shop-empty--error" role="alert">
            <FaExclamationTriangle />
            <p>Unable to load products, please try again.</p>
            <p className="shop-empty-detail">{loadError}</p>
            <button type="button" className="shop-btn shop-btn--cart" onClick={fetchProducts}>
              Retry
            </button>
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className="shop-grid" ref={gridRef}>
            {sortedProducts.map((product, i) => {
              const displayPrice = getDisplayPrice(product);
              const stock = stockInfo(product.stock);
              const qtyInCart = getCartQuantity(product);
              return (
                <article key={product.id} className="shop-card" style={{ "--i": i % 8 }}>
                  <div
                    className="shop-card-media"
                    onClick={() => setSelectedProduct(product)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelectedProduct(product)}
                    aria-label={`View ${product.name}`}
                  >
                    <ProductImage src={product.image} alt={product.name} />
                    <span className="shop-badge shop-badge--cat">{product.category}</span>
                    <span className={`shop-badge shop-badge--stock shop-badge--${stock.key}`}>{stock.label}</span>
                    {qtyInCart > 0 && (
                      <span className="shop-badge shop-badge--incart">
                        <FaCheckCircle /> {qtyInCart} in cart
                      </span>
                    )}
                    <span className="shop-card-quick" aria-hidden="true">
                      <FaExpand /> Quick view
                    </span>
                  </div>

                  <div className="shop-card-body">
                    <p className="shop-card-sku">SKU: {product.sku}</p>
                    <h3 className="shop-card-name" onClick={() => setSelectedProduct(product)}>
                      {product.name}
                    </h3>
                    {product.description && <p className="shop-card-desc">{product.description}</p>}

                    <div className="shop-card-price-row">
                      <div className="shop-price">
                        <span className="shop-price-cur">₹</span>
                        <span className="shop-price-val">{displayPrice}</span>
                      </div>
                      <span className="shop-card-stock">Stock: <strong>{product.stock}</strong></span>
                    </div>

                    {renderOptions(product, "sm")}
                    {renderActions(product, "sm")}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="shop-empty">
            <FaSearch />
            <p>No products found</p>
            {(searchQuery || selectedCategory !== "All") && (
              <button
                type="button"
                className="shop-link-btn"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
              >
                Clear search &amp; filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* ================= CART DRAWER ================= */}
      {showCart &&
        createPortal(
          <div className="shop-drawer-overlay" onClick={() => setShowCart(false)}>
            <aside className="shop-drawer" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Shopping cart">
              <div className="shop-drawer-head">
                <h2>
                  <FaShoppingBag /> Shopping Cart <span>({cartCount} items)</span>
                </h2>
                <button type="button" className="shop-icon-btn" onClick={() => setShowCart(false)} aria-label="Close cart">
                  <FaTimes />
                </button>
              </div>

              <div className="shop-drawer-items">
                {cartItems.length === 0 ? (
                  <div className="shop-drawer-empty">
                    <span aria-hidden="true">🛒</span>
                    <p>Your cart is empty</p>
                    <button type="button" className="shop-link-btn" onClick={() => setShowCart(false)}>
                      Continue shopping
                    </button>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="shop-drawer-item">
                      <div className="shop-drawer-thumb">
                        <ProductImage src={item.image} alt={item.name} fallbackClass="" />
                      </div>
                      <div className="shop-drawer-info">
                        <h4>{item.name}</h4>
                        <p>₹{item.price} each</p>
                        <div className="shop-qty shop-qty--mini" aria-label="Quantity">
                          <button type="button" aria-label="Decrease quantity" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            <FaMinus />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            disabled={item.stock != null && item.quantity >= item.stock}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </div>
                      <div className="shop-drawer-right">
                        <strong>₹{item.price * item.quantity}</strong>
                        <button type="button" className="shop-remove" onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.name}`}>
                          <FaTrashAlt />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="shop-drawer-foot">
                  <div className="shop-drawer-total">
                    <span>Total</span>
                    <strong>₹{cartTotal}</strong>
                  </div>
                  <Link to="/checkout" className="shop-btn shop-btn--checkout" onClick={() => setShowCart(false)}>
                    Proceed to Checkout <FaArrowRight />
                  </Link>
                  <button type="button" className="shop-link-btn" onClick={() => setShowCart(false)}>
                    Continue shopping
                  </button>
                </div>
              )}
            </aside>
          </div>,
          document.body
        )}

      {/* ================= PRODUCT DETAILS ================= */}
      {selectedProduct &&
        createPortal(
          <div className="shop-modal-overlay" onClick={() => setSelectedProduct(null)}>
            <div className="shop-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={selectedProduct.name}>
              <button type="button" className="shop-icon-btn shop-modal-close" onClick={() => setSelectedProduct(null)} aria-label="Close">
                <FaTimes />
              </button>

              <div className="shop-modal-media">
                <ProductImage src={selectedProduct.image} alt={selectedProduct.name} fallbackClass="shop-modal-emoji" />
                <span className={`shop-badge shop-badge--stock shop-badge--${stockInfo(selectedProduct.stock).key}`}>
                  {stockInfo(selectedProduct.stock).label}
                </span>
              </div>

              <div className="shop-modal-body">
                <span className="shop-badge shop-badge--cat shop-badge--static">{selectedProduct.category}</span>
                <h2>{selectedProduct.name}</h2>
                <p className="shop-card-sku">SKU: {selectedProduct.sku}</p>

                <h3 className="shop-modal-h">Description</h3>
                <p className="shop-modal-desc">{selectedProduct.description || "No description available"}</p>

                <div className="shop-modal-price">
                  <div>
                    <small>Price</small>
                    {/* ✅ shows the size-specific price for syringes, base price otherwise */}
                    <div className="shop-price shop-price--lg">
                      <span className="shop-price-cur">₹</span>
                      <span className="shop-price-val">{getDisplayPrice(selectedProduct)}</span>
                    </div>
                  </div>
                  <div>
                    <small>Stock</small>
                    <strong>{selectedProduct.stock} units</strong>
                  </div>
                </div>

                {renderOptions(selectedProduct, "lg")}
                {renderActions(selectedProduct, "lg")}
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ================= TOAST ================= */}
      {toast &&
        createPortal(
          <div className="shop-toast" key={toast.key} role="status">
            <FaCheckCircle />
            <span>
              <strong>Added to cart</strong>
              <small>{toast.name}</small>
            </span>
            <button type="button" onClick={() => { setToast(null); setShowCart(true); }}>
              View cart
            </button>
          </div>,
          document.body
        )}
    </div>
  );
};

export default Purchase;
