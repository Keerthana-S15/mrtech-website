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



import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Purchase.css";

// Common size options shown for every product. Feel free to edit this list.
const SIZE_OPTIONS = ["Standard", "5ml", "10ml", "20ml", "50ml", "100ml"];

const Purchase = () => {
  const { cartItems, addToCart, removeFromCart, updateQuantity, getTotalItems, getTotalPrice } = useCart();
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // ✅ NEW: tracks which size is currently chosen per product (keyed by product.id)
  const [selectedSizes, setSelectedSizes] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        alert("Failed to load products. Please refresh the page.");
      }
    };

    fetchProducts();
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

  // Get the size currently selected for a product (defaults to "Standard")
  const getSelectedSize = (productId) => selectedSizes[productId] || "Standard";

  const setSize = (productId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  // Build a unique cart-line id combining product id + size, so different
  // sizes of the same product are tracked as separate cart entries.
  const buildCartId = (productId, size) => `${productId}::${size}`;

  const handleAddToCart = (product) => {
    const size = getSelectedSize(product.id);
    const cartProduct = {
      ...product,
      id: buildCartId(product.id, size),
      baseProductId: product.id,
      size: size,
      name: size === "Standard" ? product.name : `${product.name} - ${size}`,
    };
    addToCart(cartProduct);
  };

  // How many units of THIS product + THIS selected size are already in the cart
  const getCartQuantity = (productId) => {
    const size = getSelectedSize(productId);
    const item = cartItems.find((i) => i.id === buildCartId(productId, size));
    return item ? item.quantity : 0;
  };

  const cartTotal = getTotalPrice();
  const cartCount = getTotalItems();

  return (
    <div className="purchase-page">
      <div className="purchase-hero">
        <div className="hero-content">
          <h1>G Care Medical Equipment Store</h1>
          <p>Quality Healthcare Products for Professionals & Individuals</p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">{products.length}</span>
              <span className="stat-label">Products</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">ISO</span>
              <span className="stat-label">Certified</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support</span>
            </div>
          </div>
        </div>
      </div>

      <div className="purchase-container">
        <div className="filter-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="category-filters">
            {["All", "Non-Consumable", "Consumable"].map((category) => (
              <button
                key={category}
                className={`filter-btn ${selectedCategory === category ? "active" : ""}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <button className="cart-toggle-btn" onClick={() => setShowCart(!showCart)}>
            🛒 Cart ({cartCount})
          </button>
        </div>

        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const qtyInCart = getCartQuantity(product.id);
              const currentSize = getSelectedSize(product.id);

              return (
                <div key={product.id} className="product-card">
                  <div
                    className="product-image"
                    onClick={() => setSelectedProduct(product)}
                    style={{ cursor: "pointer" }}
                  >
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                      />
                    ) : (
                      <span className="product-emoji">🧴</span>
                    )}
                    <span className="product-category-badge">{product.category}</span>
                  </div>
                  <div className="product-info">
                    <h3
                      className="product-name"
                      onClick={() => setSelectedProduct(product)}
                      style={{ cursor: "pointer" }}
                    >
                      {product.name}
                    </h3>
                    <p className="product-sku">SKU: {product.sku}</p>

                    {product.description && (
                      <p
                        className="product-description"
                        style={{
                          fontSize: 13,
                          color: "#666",
                          marginBottom: 10,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {product.description}
                      </p>
                    )}

                    <div className="product-footer">
                      <div className="product-price">
                        <span className="price-label">₹</span>
                        <span className="price-value">{product.price}</span>
                      </div>
                      <div className="product-stock">
                        Stock: <strong>{product.stock}</strong>
                      </div>
                    </div>

                    {/* ✅ NEW: Size selector — pick a size, quantity below tracks that size */}
                    <div style={{ marginBottom: 8 }}>
                      <label
                        style={{
                          fontSize: 12,
                          color: "#666",
                          display: "block",
                          marginBottom: 4,
                        }}
                      >
                        Size
                      </label>
                      <select
                        value={currentSize}
                        onChange={(e) => setSize(product.id, e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px",
                          borderRadius: 6,
                          border: "1px solid #ccc",
                          fontSize: 13,
                        }}
                      >
                        {SIZE_OPTIONS.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>

                    {qtyInCart === 0 ? (
                      <button
                        className="add-to-cart-btn"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                      >
                        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                      </button>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          background: "#ff6600",
                          borderRadius: 8,
                          padding: "4px",
                          marginTop: 8,
                        }}
                      >
                        <button
                          aria-label="Decrease quantity"
                          onClick={() =>
                            updateQuantity(buildCartId(product.id, currentSize), qtyInCart - 1)
                          }
                          style={{
                            width: 36,
                            height: 36,
                            border: "none",
                            background: "transparent",
                            color: "white",
                            fontSize: 20,
                            fontWeight: 600,
                            cursor: "pointer",
                            borderRadius: 6,
                          }}
                        >
                          −
                        </button>
                        <span style={{ color: "white", fontWeight: 600, fontSize: 15 }}>
                          {qtyInCart}
                        </span>
                        <button
                          aria-label="Increase quantity"
                          onClick={() => {
                            if (qtyInCart < product.stock) {
                              updateQuantity(buildCartId(product.id, currentSize), qtyInCart + 1);
                            }
                          }}
                          disabled={qtyInCart >= product.stock}
                          style={{
                            width: 36,
                            height: 36,
                            border: "none",
                            background: "transparent",
                            color: "white",
                            fontSize: 20,
                            fontWeight: 600,
                            cursor: qtyInCart >= product.stock ? "not-allowed" : "pointer",
                            opacity: qtyInCart >= product.stock ? 0.5 : 1,
                            borderRadius: 6,
                          }}
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-products">
              <p>No products found</p>
            </div>
          )}
        </div>
      </div>

      {showCart && (
        <div className="cart-overlay" onClick={() => setShowCart(false)}>
          <div className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <h2>Shopping Cart ({cartCount} items)</h2>
              <button className="close-cart-btn" onClick={() => setShowCart(false)}>
                ✕
              </button>
            </div>

            <div className="cart-items">
              {cartItems.length === 0 ? (
                <div className="empty-cart">
                  <p>Your cart is empty</p>
                  <span>🛒</span>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }}
                      />
                    ) : (
                      <span className="cart-item-emoji">🧴</span>
                    )}
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <p>
                        ₹{item.price} × {item.quantity}
                      </p>
                    </div>
                    <div className="cart-item-total">₹{item.price * item.quantity}</div>
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="cart-footer">
                <div className="cart-total">
                  <span>Total:</span>
                  <span className="total-amount">₹{cartTotal}</span>
                </div>
                <Link to="/checkout" className="checkout-btn">
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedProduct && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedProduct(null)}
          style={{ zIndex: 2000 }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 700 }}
          >
            <div className="modal-header">
              <h2>{selectedProduct.name}</h2>
              <button className="close-modal" onClick={() => setSelectedProduct(null)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>
                <div>
                  {selectedProduct.image ? (
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      style={{ width: "100%", borderRadius: 15, border: "2px solid #f0f0f0" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: 300,
                        background: "#f5f5f5",
                        borderRadius: 15,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 80,
                      }}
                    >
                      🧴
                    </div>
                  )}
                </div>

                <div>
                  <p style={{ fontSize: 12, color: "#999", marginBottom: 10, fontFamily: "monospace" }}>
                    SKU: {selectedProduct.sku}
                  </p>

                  <div style={{ marginBottom: 20 }}>
                    <span
                      style={{
                        background: "rgba(0, 51, 61, 0.1)",
                        color: "#00333d",
                        padding: "6px 12px",
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {selectedProduct.category}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: 16,
                      color: "#00333d",
                      marginBottom: 10,
                      borderLeft: "4px solid #ff6600",
                      paddingLeft: 10,
                    }}
                  >
                    Description
                  </h3>
                  <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6, marginBottom: 20 }}>
                    {selectedProduct.description || "No description available"}
                  </p>

                  <div
                    style={{
                      padding: 20,
                      background: "#f9f9f9",
                      borderRadius: 10,
                      marginBottom: 20,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                      <span style={{ color: "#666" }}>Price:</span>
                      <span style={{ fontSize: 24, fontWeight: 700, color: "#ff6600" }}>
                        ₹{selectedProduct.price}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#666" }}>Stock:</span>
                      <span style={{ fontWeight: 600, color: "#00333d" }}>
                        {selectedProduct.stock} units
                      </span>
                    </div>
                  </div>

                  {/* Size selector in modal too */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 6 }}>
                      Size
                    </label>
                    <select
                      value={getSelectedSize(selectedProduct.id)}
                      onChange={(e) => setSize(selectedProduct.id, e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: 8,
                        border: "1px solid #ccc",
                        fontSize: 14,
                      }}
                    >
                      {SIZE_OPTIONS.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>

                  {getCartQuantity(selectedProduct.id) === 0 ? (
                    <button
                      style={{
                        width: "100%",
                        padding: 16,
                        background: "linear-gradient(135deg, #ff6600, #ff8c00)",
                        color: "white",
                        border: "none",
                        borderRadius: 10,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontSize: 16,
                        boxShadow: "0 4px 15px rgba(255, 102, 0, 0.3)",
                      }}
                      onClick={() => handleAddToCart(selectedProduct)}
                      disabled={selectedProduct.stock === 0}
                    >
                      {selectedProduct.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: "#ff6600",
                        borderRadius: 10,
                        padding: "6px",
                      }}
                    >
                      <button
                        aria-label="Decrease quantity"
                        onClick={() =>
                          updateQuantity(
                            buildCartId(selectedProduct.id, getSelectedSize(selectedProduct.id)),
                            getCartQuantity(selectedProduct.id) - 1
                          )
                        }
                        style={{
                          width: 44,
                          height: 44,
                          border: "none",
                          background: "transparent",
                          color: "white",
                          fontSize: 22,
                          fontWeight: 600,
                          cursor: "pointer",
                          borderRadius: 8,
                        }}
                      >
                        −
                      </button>
                      <span style={{ color: "white", fontWeight: 600, fontSize: 17 }}>
                        {getCartQuantity(selectedProduct.id)}
                      </span>
                      <button
                        aria-label="Increase quantity"
                        onClick={() => {
                          const current = getCartQuantity(selectedProduct.id);
                          if (current < selectedProduct.stock) {
                            updateQuantity(
                              buildCartId(selectedProduct.id, getSelectedSize(selectedProduct.id)),
                              current + 1
                            );
                          }
                        }}
                        disabled={getCartQuantity(selectedProduct.id) >= selectedProduct.stock}
                        style={{
                          width: 44,
                          height: 44,
                          border: "none",
                          background: "transparent",
                          color: "white",
                          fontSize: 22,
                          fontWeight: 600,
                          cursor:
                            getCartQuantity(selectedProduct.id) >= selectedProduct.stock
                              ? "not-allowed"
                              : "pointer",
                          opacity:
                            getCartQuantity(selectedProduct.id) >= selectedProduct.stock ? 0.5 : 1,
                          borderRadius: 8,
                        }}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Purchase;