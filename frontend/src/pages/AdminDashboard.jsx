// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import * as XLSX from "xlsx";
// import "./AdminDashboard.css";

// export default function AdminDashboard() {
//   const navigate = useNavigate();
//   const [currentTab, setCurrentTab] = useState("dashboard");
//   const [orders, setOrders] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [editingProduct, setEditingProduct] = useState(null);
//   const [selectedStat, setSelectedStat] = useState(null);
  
//   const [formData, setFormData] = useState({
//     name: "",
//     category: "",
//     stock: "",
//     price: "",
//     sku: "",
//     description: "",
//   });

//   const [productImage, setProductImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);

//   useEffect(() => {
//     fetchOrders();
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const res = await fetch("/api/products");
//       const data = await res.json();
//       if (data.success) setProducts(data.products);
//     } catch (err) {
//       console.error("Error fetching products:", err);
//     }
//   };

//   const fetchOrders = async () => {
//     try {
//       const response = await fetch("/api/orders");
//       const data = await response.json();
//       if (data.success) {
//         const formatted = data.orders.map((o) => ({
//           id: o.orderId,
//           customer: o.customerName,
//           email: o.email,
//           phone: o.phone,
//           items: Array.isArray(o.items)
//             ? o.items.map((i) => i.name).join(", ")
//             : o.items,
//           total: o.totalAmount,
//           status: o.orderStatus,
//           date: new Date(o.createdAt).toLocaleDateString(),
//           address:
//             typeof o.shippingAddress === "object"
//               ? `${o.shippingAddress.address}, ${o.shippingAddress.city}, ${o.shippingAddress.state} - ${o.shippingAddress.pincode}`
//               : o.shippingAddress,
//           fullData: o,
//         }));
//         setOrders(formatted);
//       }
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setProductImage(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSaveProduct = async (e) => {
//     e.preventDefault();
//     try {
//       const formDataToSend = new FormData();
//       formDataToSend.append("name", formData.name);
//       formDataToSend.append("category", formData.category);
//       formDataToSend.append("price", formData.price);
//       formDataToSend.append("stock", formData.stock);
//       formDataToSend.append("sku", formData.sku);
//       formDataToSend.append("description", formData.description);
      
//       if (productImage) {
//         formDataToSend.append("image", productImage);
//       }

//       const url = editingProduct
//         ? `/api/products/${editingProduct.id}`
//         : "/api/products";
//       const method = editingProduct ? "PUT" : "POST";
      
//       const res = await fetch(url, {
//         method,
//         body: formDataToSend,
//       });
      
//       const data = await res.json();
//       if (data.success) {
//         alert(editingProduct ? "✅ Product updated!" : "✅ Product added!");
//         setShowForm(false);
//         setEditingProduct(null);
//         setFormData({ name: "", category: "", stock: "", price: "", sku: "", description: "" });
//         setProductImage(null);
//         setImagePreview(null);
//         fetchProducts();
//       } else alert("❌ " + data.error);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleDeleteProduct = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this product?")) return;
//     try {
//       const res = await fetch(`/api/products/${id}`, {
//         method: "DELETE",
//       });
//       const data = await res.json();
//       if (data.success) {
//         alert("🗑️ Product deleted!");
//         fetchProducts();
//       } else alert("❌ " + data.error);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const updateOrderStatus = async (orderId, newStatus) => {
//     try {
//       const res = await fetch(`/api/orders/${orderId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ orderStatus: newStatus }),
//       });
//       const result = await res.json();

//       if (result.success) {
//         setOrders((prev) =>
//           prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
//         );

//         if (selectedOrder && selectedOrder.id === orderId) {
//           setSelectedOrder({ ...selectedOrder, status: newStatus });
//         }

//         alert("✅ Order status updated successfully!");
//       } else {
//         alert("❌ " + (result.error || "Failed to update order"));
//       }
//     } catch (err) {
//       console.error("Update error:", err);
//       alert("❌ Error updating order status");
//     }
//   };

//   const handleExportExcel = async () => {
//     try {
//       const res = await fetch("/api/products");
//       const data = await res.json();

//       if (data.success && data.products.length > 0) {
//         const worksheet = XLSX.utils.json_to_sheet(
//           data.products.map((p) => ({
//             Name: p.name,
//             Category: p.category,
//             Stock: p.stock,
//             Price: p.price,
//             SKU: p.sku,
//             Description: p.description || "",
//           }))
//         );
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
//         XLSX.writeFile(workbook, "products_export.xlsx");
//         alert("✅ Excel downloaded successfully!");
//       } else {
//         alert("⚠️ No products available to export!");
//       }
//     } catch (error) {
//       console.error("Excel Export Error:", error);
//       alert("❌ Failed to export products to Excel");
//     }
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   const totalOrders = orders.length;
//   const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
//   const pendingOrders = orders.filter((o) => o.status === "pending").length;
//   const lowStockItems = products.filter((p) => p.stock < 5).length;

//   const statusColors = {
//     pending: "status-pending",
//     processing: "status-processing",
//     shipped: "status-shipped",
//     delivered: "status-delivered",
//   };

//   const customers = Object.values(
//     orders.reduce((acc, o) => {
//       if (!acc[o.customer]) {
//         acc[o.customer] = {
//           name: o.customer,
//           email: o.email,
//           totalOrders: 0,
//           totalSpent: 0,
//           lastDate: o.date,
//         };
//       }
//       acc[o.customer].totalOrders += 1;
//       acc[o.customer].totalSpent += o.total;
//       acc[o.customer].lastDate = o.date;
//       return acc;
//     }, {})
//   );

//   const getFilteredData = () => {
//     if (selectedStat === "pending")
//       return orders.filter((o) => o.status === "pending");
//     if (selectedStat === "lowstock") return products.filter((p) => p.stock < 5);
//     if (selectedStat === "orders") return orders;
//     return [];
//   };

//   return (
//     <div className="admin-dashboard">
//       <aside className="admin-sidebar">
//         <div className="admin-brand">
//           <div className="admin-logo">
//             <img src="/MR LOGO.jpeg" alt="Logo" />
//           </div>
//           <h2>Admin Panel</h2>
//           <p>G Care Management</p>
//         </div>

//         <nav className="admin-nav">
//           {["dashboard", "orders", "products", "customers", "settings"].map((tab) => (
//             <button
//               key={tab}
//               className={`admin-nav-item ${currentTab === tab ? "active" : ""}`}
//               onClick={() => setCurrentTab(tab)}
//             >
//               {tab === "dashboard" && "📊 "}
//               {tab === "orders" && "🛒 "}
//               {tab === "products" && "📦 "}
//               {tab === "customers" && "👥 "}
//               {tab === "settings" && "⚙️ "}
//               {tab.charAt(0).toUpperCase() + tab.slice(1)}
//               {tab === "orders" && pendingOrders > 0 && (
//                 <span className="badge">{pendingOrders}</span>
//               )}
//             </button>
//           ))}
//         </nav>

//         <button className="admin-logout" onClick={handleLogout}>
//           🚪 Logout
//         </button>
//       </aside>

//       <main className="admin-main">
//         <header className="admin-header">
//           <div>
//             <h1>{currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}</h1>
//             <p>Welcome back, Admin</p>
//           </div>
//           <div className="admin-user">
//             <span>🔔</span>
//             <div className="admin-avatar">A</div>
//           </div>
//         </header>

//         {currentTab === "dashboard" && (
//           <div className="admin-content">
//             <div className="stats-grid">
//               <div className="stat-card card-blue" onClick={() => setSelectedStat("orders")}>
//                 <h3>Total Orders</h3>
//                 <p>{totalOrders}</p>
//               </div>
//               <div className="stat-card card-green">
//                 <h3>Total Revenue</h3>
//                 <p>₹{totalRevenue.toLocaleString()}</p>
//               </div>
//               <div className="stat-card card-yellow" onClick={() => setSelectedStat("pending")}>
//                 <h3>Pending Orders</h3>
//                 <p>{pendingOrders}</p>
//               </div>
//               <div className="stat-card card-red" onClick={() => setSelectedStat("lowstock")}>
//                 <h3>Low Stock Items</h3>
//                 <p>{lowStockItems}</p>
//               </div>
//             </div>

//             {selectedStat && (
//               <div className="admin-card">
//                 <h2>
//                   {selectedStat === "orders"
//                     ? "All Orders"
//                     : selectedStat === "pending"
//                     ? "Pending Orders"
//                     : "Low Stock Products"}
//                 </h2>
//                 {selectedStat === "lowstock" ? (
//                   <table className="admin-table">
//                     <thead>
//                       <tr>
//                         <th>SKU</th>
//                         <th>Name</th>
//                         <th>Stock</th>
//                         <th>Price</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {getFilteredData().map((p) => (
//                         <tr key={p.id}>
//                           <td>{p.sku}</td>
//                           <td>{p.name}</td>
//                           <td>{p.stock}</td>
//                           <td>₹{p.price}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 ) : (
//                   <table className="admin-table">
//                     <thead>
//                       <tr>
//                         <th>Order ID</th>
//                         <th>Customer</th>
//                         <th>Total</th>
//                         <th>Status</th>
//                         <th>Date</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {getFilteredData().map((o) => (
//                         <tr key={o.id}>
//                           <td>{o.id}</td>
//                           <td>{o.customer}</td>
//                           <td>₹{o.total}</td>
//                           <td>
//                             <span className={`status-badge ${statusColors[o.status]}`}>
//                               {o.status}
//                             </span>
//                           </td>
//                           <td>{o.date}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 )}
//               </div>
//             )}
//           </div>
//         )}

//         {currentTab === "orders" && (
//           <div className="admin-content">
//             <div className="admin-card">
//               <h2>All Orders</h2>
//               {loading ? (
//                 <p>Loading...</p>
//               ) : orders.length === 0 ? (
//                 <p>No orders yet</p>
//               ) : (
//                 <table className="admin-table">
//                   <thead>
//                     <tr>
//                       <th>Order ID</th>
//                       <th>Customer</th>
//                       <th>Items</th>
//                       <th>Total</th>
//                       <th>Status</th>
//                       <th>Date</th>
//                       <th>Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {orders.map((o) => (
//                       <tr key={o.id}>
//                         <td>{o.id}</td>
//                         <td>{o.customer}</td>
//                         <td>{o.items}</td>
//                         <td>₹{o.total}</td>
//                         <td>
//                           <span className={`status-badge ${statusColors[o.status]}`}>
//                             {o.status}
//                           </span>
//                         </td>
//                         <td>{o.date}</td>
//                         <td>
//                           <button onClick={() => setSelectedOrder(o)}>👁 View</button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               )}
//             </div>

//             {selectedOrder && (
//               <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
//                 <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
//                   <div className="modal-header">
//                     <h2>Order Details</h2>
//                     <button className="close-modal" onClick={() => setSelectedOrder(null)}>
//                       ✕
//                     </button>
//                   </div>
//                   <div className="modal-body">
//                     <div className="detail-section">
//                       <h3>👤 Customer Info</h3>
//                       <p><strong>Name:</strong> {selectedOrder.customer}</p>
//                       <p><strong>Email:</strong> {selectedOrder.email}</p>
//                       <p><strong>Phone:</strong> {selectedOrder.phone}</p>
//                     </div>
//                     <div className="detail-section">
//                       <h3>📍 Address</h3>
//                       <p>{selectedOrder.address}</p>
//                     </div>
//                     <div className="detail-section">
//                       <h3>📦 Items</h3>
//                       <p>{selectedOrder.items}</p>
//                       <p><strong>Total:</strong> ₹{selectedOrder.total}</p>
//                     </div>
//                     <div className="detail-section">
//                       <h3>Update Status</h3>
//                       <div className="status-buttons">
//                         {["pending", "processing", "shipped", "delivered"].map((s) => (
//                           <button
//                             key={s}
//                             className={`status-update-btn ${
//                               selectedOrder.status === s ? "active" : ""
//                             }`}
//                             onClick={() => updateOrderStatus(selectedOrder.id, s)}
//                           >
//                             {s}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="modal-footer">
//                     <button className="print-btn">🖨 Print Invoice</button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {currentTab === "products" && (
//           <div className="admin-content">
//             <div className="admin-card">
//               <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//                 <h2>Products Management</h2>
//                 <div className="action-buttons" style={{ display: 'flex', gap: '15px' }}>
//                   <button
//                     className="add-btn"
//                     onClick={() => {
//                       setShowForm(true);
//                       setEditingProduct(null);
//                       setFormData({ name: "", category: "", stock: "", price: "", sku: "", description: "" });
//                       setProductImage(null);
//                       setImagePreview(null);
//                     }}
//                   >
//                     ➕ Add Product
//                   </button>
//                   <button className="import-btn" onClick={handleExportExcel}>
//                     📤 Import Excel
//                   </button>
//                 </div>
//               </div>
//               <div className="admin-table">
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>Image</th>
//                       <th>SKU</th>
//                       <th>Product Name</th>
//                       <th>Category</th>
//                       <th>Stock</th>
//                       <th>Price</th>
//                       <th>Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {products.map((p) => (
//                       <tr key={p.id}>
//                         <td>
//                           {p.image ? (
//                             <img
//                               src={p.image}
//                               alt={p.name}
//                               style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 5 }}
//                             />
//                           ) : (
//                             <div style={{ 
//                               width: 50, 
//                               height: 50, 
//                               background: "#f0f0f0", 
//                               borderRadius: 5,
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center",
//                               fontSize: 20
//                             }}>
//                               🧴
//                             </div>
//                           )}
//                         </td>
//                         <td className="product-sku">{p.sku}</td>
//                         <td><strong>{p.name}</strong></td>
//                         <td>
//                           <span className="category-badge">{p.category}</span>
//                         </td>
//                         <td>
//                           <span className={p.stock < 5 ? "stock-low" : "stock-good"}>
//                             {p.stock}
//                           </span>
//                         </td>
//                         <td><strong>₹{p.price}</strong></td>
//                         <td>
//                           <button
//                             className="edit-btn"
//                             onClick={() => {
//                               setEditingProduct(p);
//                               setFormData({
//                                 name: p.name,
//                                 category: p.category,
//                                 stock: p.stock,
//                                 price: p.price,
//                                 sku: p.sku,
//                                 description: p.description || "",
//                               });
//                               setImagePreview(p.image);
//                               setShowForm(true);
//                             }}
//                           >
//                             ✏️
//                           </button>
//                           <button
//                             className="delete-btn"
//                             onClick={() => handleDeleteProduct(p.id)}
//                           >
//                             🗑️
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {showForm && (
//               <div className="modal-overlay" onClick={() => setShowForm(false)}>
//                 <div className="modal-content wide" onClick={(e) => e.stopPropagation()}>
//                   <div className="modal-header">
//                     <h2>{editingProduct ? "Edit Product" : "Add Product"}</h2>
//                     <button className="close-modal" onClick={() => setShowForm(false)}>
//                       ✕
//                     </button>
//                   </div>
//                   <div className="modal-body">
//                     <form onSubmit={handleSaveProduct}>
//                       <input
//                         type="text"
//                         placeholder="Product Name"
//                         value={formData.name}
//                         onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                         required
//                       />
                      
//                       <select
//                         value={formData.category}
//                         onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//                         required
//                         style={{ 
//                           padding: '12px', 
//                           width: '100%', 
//                           fontSize: '14px',
//                           marginBottom: '15px',
//                           borderRadius: '10px',
//                           border: '1.5px solid #ddd'
//                         }}
//                       >
//                         <option value="">Select Category</option>
//                         <option value="Non-Consumable">Non-Consumable</option>
//                         <option value="Consumable">Consumable</option>
//                       </select>
                      
//                       <input
//                         type="text"
//                         placeholder="SKU"
//                         value={formData.sku}
//                         onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
//                         required
//                       />
                      
//                       <input
//                         type="number"
//                         placeholder="Stock"
//                         value={formData.stock}
//                         onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
//                         required
//                       />
                      
//                       <input
//                         type="number"
//                         placeholder="Price"
//                         value={formData.price}
//                         onChange={(e) => setFormData({ ...formData, price: e.target.value })}
//                         required
//                       />

//                       <textarea
//                         placeholder="Product Description"
//                         value={formData.description}
//                         onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                         rows="4"
//                         style={{
//                           width: "100%",
//                           marginBottom: 15,
//                           padding: 12,
//                           borderRadius: 10,
//                           border: "1.5px solid #ddd",
//                           fontSize: 14,
//                           fontFamily: "inherit",
//                           resize: "vertical"
//                         }}
//                       />

//                       <div style={{ marginBottom: 15 }}>
//                         <label
//                           htmlFor="product-image"
//                           style={{
//                             display: "block",
//                             marginBottom: 8,
//                             fontSize: 14,
//                             fontWeight: 600,
//                             color: "#00333d"
//                           }}
//                         >
//                           Product Image
//                         </label>
//                         <input
//                           id="product-image"
//                           type="file"
//                           accept="image/*"
//                           onChange={handleImageChange}
//                           style={{
//                             width: "100%",
//                             padding: 10,
//                             border: "1.5px solid #ddd",
//                             borderRadius: 10,
//                             fontSize: 14
//                           }}
//                         />
//                         {imagePreview && (
//                           <div style={{ marginTop: 15, textAlign: "center" }}>
//                             <img
//                               src={imagePreview}
//                               alt="Preview"
//                               style={{
//                                 maxWidth: "100%",
//                                 maxHeight: 200,
//                                 borderRadius: 10,
//                                 border: "2px solid #f0f0f0"
//                               }}
//                             />
//                           </div>
//                         )}
//                       </div>
                      
//                       <button type="submit">
//                         {editingProduct ? "Update Product" : "Add Product"}
//                       </button>
//                     </form>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {currentTab === "customers" && (
//           <div className="admin-content">
//             <div className="admin-card">
//               <h2>Customers & Past Orders</h2>
//               <table className="admin-table">
//                 <thead>
//                   <tr>
//                     <th>Name</th>
//                     <th>Email</th>
//                     <th>Total Orders</th>
//                     <th>Total Spent</th>
//                     <th>Last Order Date</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {customers.map((c) => (
//                     <tr key={c.email}>
//                       <td>{c.name}</td>
//                       <td>{c.email}</td>
//                       <td>{c.totalOrders}</td>
//                       <td>₹{c.totalSpent}</td>
//                       <td>{c.lastDate}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {currentTab === "settings" && (
//           <div className="admin-content">
//             <div className="admin-card">
//               <h2>⚙️ Settings</h2>
//               <p>Here you can manage profile, notifications, and system preferences.</p>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }





// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import * as XLSX from "xlsx";
// import "./AdminDashboard.css";

// export default function AdminDashboard() {
//   const navigate = useNavigate();
//   const [currentTab, setCurrentTab] = useState("dashboard");
//   const [orders, setOrders] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [editingProduct, setEditingProduct] = useState(null);
//   const [selectedStat, setSelectedStat] = useState(null);

//   // ✅ NEW: search query for the Products table
//   const [productSearchQuery, setProductSearchQuery] = useState("");

//   const [formData, setFormData] = useState({
//     name: "",
//     category: "",
//     stock: "",
//     price: "",
//     sku: "",
//     description: "",
//   });

//   const [productImage, setProductImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);

//   useEffect(() => {
//     fetchOrders();
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const res = await fetch("/api/products");
//       const data = await res.json();
//       if (data.success) setProducts(data.products);
//     } catch (err) {
//       console.error("Error fetching products:", err);
//     }
//   };

//   const fetchOrders = async () => {
//     try {
//       const response = await fetch("/api/orders");
//       const data = await response.json();
//       if (data.success) {
//         const formatted = data.orders.map((o) => ({
//           id: o.orderId,
//           customer: o.customerName,
//           email: o.email,
//           phone: o.phone,
//           items: Array.isArray(o.items)
//             ? o.items.map((i) => i.name).join(", ")
//             : o.items,
//           total: o.totalAmount,
//           status: o.orderStatus,
//           date: new Date(o.createdAt).toLocaleDateString(),
//           address:
//             typeof o.shippingAddress === "object"
//               ? `${o.shippingAddress.address}, ${o.shippingAddress.city}, ${o.shippingAddress.state} - ${o.shippingAddress.pincode}`
//               : o.shippingAddress,
//           fullData: o,
//         }));
//         setOrders(formatted);
//       }
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setProductImage(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSaveProduct = async (e) => {
//     e.preventDefault();
//     try {
//       const formDataToSend = new FormData();
//       formDataToSend.append("name", formData.name);
//       formDataToSend.append("category", formData.category);
//       formDataToSend.append("price", formData.price);
//       formDataToSend.append("stock", formData.stock);
//       formDataToSend.append("sku", formData.sku);
//       formDataToSend.append("description", formData.description);

//       if (productImage) {
//         formDataToSend.append("image", productImage);
//       }

//       const url = editingProduct
//         ? `/api/products/${editingProduct.id}`
//         : "/api/products";
//       const method = editingProduct ? "PUT" : "POST";

//       const res = await fetch(url, {
//         method,
//         body: formDataToSend,
//       });

//       const data = await res.json();
//       if (data.success) {
//         alert(editingProduct ? "✅ Product updated!" : "✅ Product added!");
//         setShowForm(false);
//         setEditingProduct(null);
//         setFormData({ name: "", category: "", stock: "", price: "", sku: "", description: "" });
//         setProductImage(null);
//         setImagePreview(null);
//         fetchProducts();
//       } else alert("❌ " + data.error);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleDeleteProduct = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this product?")) return;
//     try {
//       const res = await fetch(`/api/products/${id}`, {
//         method: "DELETE",
//       });
//       const data = await res.json();
//       if (data.success) {
//         alert("🗑️ Product deleted!");
//         fetchProducts();
//       } else alert("❌ " + data.error);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const updateOrderStatus = async (orderId, newStatus) => {
//     try {
//       const res = await fetch(`/api/orders/${orderId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ orderStatus: newStatus }),
//       });
//       const result = await res.json();

//       if (result.success) {
//         setOrders((prev) =>
//           prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
//         );

//         if (selectedOrder && selectedOrder.id === orderId) {
//           setSelectedOrder({ ...selectedOrder, status: newStatus });
//         }

//         alert("✅ Order status updated successfully!");
//       } else {
//         alert("❌ " + (result.error || "Failed to update order"));
//       }
//     } catch (err) {
//       console.error("Update error:", err);
//       alert("❌ Error updating order status");
//     }
//   };

//   const handleExportExcel = async () => {
//     try {
//       const res = await fetch("/api/products");
//       const data = await res.json();

//       if (data.success && data.products.length > 0) {
//         const worksheet = XLSX.utils.json_to_sheet(
//           data.products.map((p) => ({
//             Name: p.name,
//             Category: p.category,
//             Stock: p.stock,
//             Price: p.price,
//             SKU: p.sku,
//             Description: p.description || "",
//           }))
//         );
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
//         XLSX.writeFile(workbook, "products_export.xlsx");
//         alert("✅ Excel downloaded successfully!");
//       } else {
//         alert("⚠️ No products available to export!");
//       }
//     } catch (error) {
//       console.error("Excel Export Error:", error);
//       alert("❌ Failed to export products to Excel");
//     }
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   const totalOrders = orders.length;
//   const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
//   const pendingOrders = orders.filter((o) => o.status === "pending").length;
//   const lowStockItems = products.filter((p) => p.stock < 5).length;

//   const statusColors = {
//     pending: "status-pending",
//     processing: "status-processing",
//     shipped: "status-shipped",
//     delivered: "status-delivered",
//   };

//   const customers = Object.values(
//     orders.reduce((acc, o) => {
//       if (!acc[o.customer]) {
//         acc[o.customer] = {
//           name: o.customer,
//           email: o.email,
//           totalOrders: 0,
//           totalSpent: 0,
//           lastDate: o.date,
//         };
//       }
//       acc[o.customer].totalOrders += 1;
//       acc[o.customer].totalSpent += o.total;
//       acc[o.customer].lastDate = o.date;
//       return acc;
//     }, {})
//   );

//   const getFilteredData = () => {
//     if (selectedStat === "pending")
//       return orders.filter((o) => o.status === "pending");
//     if (selectedStat === "lowstock") return products.filter((p) => p.stock < 5);
//     if (selectedStat === "orders") return orders;
//     return [];
//   };

//   // ✅ NEW: products filtered by the search box (matches name or SKU)
//   const filteredProducts = products.filter((p) => {
//     const query = productSearchQuery.trim().toLowerCase();
//     if (!query) return true;
//     return (
//       p.name?.toLowerCase().includes(query) ||
//       p.sku?.toString().toLowerCase().includes(query)
//     );
//   });

//   return (
//     <div className="admin-dashboard">
//       <aside className="admin-sidebar">
//         <div className="admin-brand">
//           <div className="admin-logo">
//             <img src="/MR LOGO.jpeg" alt="Logo" />
//           </div>
//           <h2>Admin Panel</h2>
//           <p>G Care Management</p>
//         </div>

//         <nav className="admin-nav">
//           {["dashboard", "orders", "products", "customers", "settings"].map((tab) => (
//             <button
//               key={tab}
//               className={`admin-nav-item ${currentTab === tab ? "active" : ""}`}
//               onClick={() => setCurrentTab(tab)}
//             >
//               {tab === "dashboard" && "📊 "}
//               {tab === "orders" && "🛒 "}
//               {tab === "products" && "📦 "}
//               {tab === "customers" && "👥 "}
//               {tab === "settings" && "⚙️ "}
//               {tab.charAt(0).toUpperCase() + tab.slice(1)}
//               {tab === "orders" && pendingOrders > 0 && (
//                 <span className="badge">{pendingOrders}</span>
//               )}
//             </button>
//           ))}
//         </nav>

//         <button className="admin-logout" onClick={handleLogout}>
//           🚪 Logout
//         </button>
//       </aside>

//       <main className="admin-main">
//         <header className="admin-header">
//           <div>
//             <h1>{currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}</h1>
//             <p>Welcome back, Admin</p>
//           </div>
//           <div className="admin-user">
//             <span>🔔</span>
//             <div className="admin-avatar">A</div>
//           </div>
//         </header>

//         {currentTab === "dashboard" && (
//           <div className="admin-content">
//             <div className="stats-grid">
//               <div className="stat-card card-blue" onClick={() => setSelectedStat("orders")}>
//                 <h3>Total Orders</h3>
//                 <p>{totalOrders}</p>
//               </div>
//               <div className="stat-card card-green">
//                 <h3>Total Revenue</h3>
//                 <p>₹{totalRevenue.toLocaleString()}</p>
//               </div>
//               <div className="stat-card card-yellow" onClick={() => setSelectedStat("pending")}>
//                 <h3>Pending Orders</h3>
//                 <p>{pendingOrders}</p>
//               </div>
//               <div className="stat-card card-red" onClick={() => setSelectedStat("lowstock")}>
//                 <h3>Low Stock Items</h3>
//                 <p>{lowStockItems}</p>
//               </div>
//             </div>

//             {selectedStat && (
//               <div className="admin-card">
//                 <h2>
//                   {selectedStat === "orders"
//                     ? "All Orders"
//                     : selectedStat === "pending"
//                     ? "Pending Orders"
//                     : "Low Stock Products"}
//                 </h2>
//                 {selectedStat === "lowstock" ? (
//                   <table className="admin-table">
//                     <thead>
//                       <tr>
//                         <th>SKU</th>
//                         <th>Name</th>
//                         <th>Stock</th>
//                         <th>Price</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {getFilteredData().map((p) => (
//                         <tr key={p.id}>
//                           <td>{p.sku}</td>
//                           <td>{p.name}</td>
//                           <td>{p.stock}</td>
//                           <td>₹{p.price}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 ) : (
//                   <table className="admin-table">
//                     <thead>
//                       <tr>
//                         <th>Order ID</th>
//                         <th>Customer</th>
//                         <th>Total</th>
//                         <th>Status</th>
//                         <th>Date</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {getFilteredData().map((o) => (
//                         <tr key={o.id}>
//                           <td>{o.id}</td>
//                           <td>{o.customer}</td>
//                           <td>₹{o.total}</td>
//                           <td>
//                             <span className={`status-badge ${statusColors[o.status]}`}>
//                               {o.status}
//                             </span>
//                           </td>
//                           <td>{o.date}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 )}
//               </div>
//             )}
//           </div>
//         )}

//         {currentTab === "orders" && (
//           <div className="admin-content">
//             <div className="admin-card">
//               <h2>All Orders</h2>
//               {loading ? (
//                 <p>Loading...</p>
//               ) : orders.length === 0 ? (
//                 <p>No orders yet</p>
//               ) : (
//                 <table className="admin-table">
//                   <thead>
//                     <tr>
//                       <th>Order ID</th>
//                       <th>Customer</th>
//                       <th>Items</th>
//                       <th>Total</th>
//                       <th>Status</th>
//                       <th>Date</th>
//                       <th>Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {orders.map((o) => (
//                       <tr key={o.id}>
//                         <td>{o.id}</td>
//                         <td>{o.customer}</td>
//                         <td>{o.items}</td>
//                         <td>₹{o.total}</td>
//                         <td>
//                           <span className={`status-badge ${statusColors[o.status]}`}>
//                             {o.status}
//                           </span>
//                         </td>
//                         <td>{o.date}</td>
//                         <td>
//                           <button onClick={() => setSelectedOrder(o)}>👁 View</button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               )}
//             </div>

//             {selectedOrder && (
//               <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
//                 <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
//                   <div className="modal-header">
//                     <h2>Order Details</h2>
//                     <button className="close-modal" onClick={() => setSelectedOrder(null)}>
//                       ✕
//                     </button>
//                   </div>
//                   <div className="modal-body">
//                     <div className="detail-section">
//                       <h3>👤 Customer Info</h3>
//                       <p><strong>Name:</strong> {selectedOrder.customer}</p>
//                       <p><strong>Email:</strong> {selectedOrder.email}</p>
//                       <p><strong>Phone:</strong> {selectedOrder.phone}</p>
//                     </div>
//                     <div className="detail-section">
//                       <h3>📍 Address</h3>
//                       <p>{selectedOrder.address}</p>
//                     </div>
//                     <div className="detail-section">
//                       <h3>📦 Items</h3>
//                       <p>{selectedOrder.items}</p>
//                       <p><strong>Total:</strong> ₹{selectedOrder.total}</p>
//                     </div>
//                     <div className="detail-section">
//                       <h3>Update Status</h3>
//                       <div className="status-buttons">
//                         {["pending", "processing", "shipped", "delivered"].map((s) => (
//                           <button
//                             key={s}
//                             className={`status-update-btn ${
//                               selectedOrder.status === s ? "active" : ""
//                             }`}
//                             onClick={() => updateOrderStatus(selectedOrder.id, s)}
//                           >
//                             {s}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="modal-footer">
//                     <button className="print-btn">🖨 Print Invoice</button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {currentTab === "products" && (
//           <div className="admin-content">
//             <div className="admin-card">
//               <div
//                 className="card-header"
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   marginBottom: "20px",
//                   gap: "15px",
//                   flexWrap: "wrap",
//                 }}
//               >
//                 <h2>Products Management</h2>

//                 {/* ✅ NEW: search box — filters the table below by name or SKU */}
//                 <div style={{ flex: "1 1 260px", maxWidth: 320 }}>
//                   <input
//                     type="text"
//                     placeholder="🔍 Search by name or SKU..."
//                     value={productSearchQuery}
//                     onChange={(e) => setProductSearchQuery(e.target.value)}
//                     style={{
//                       width: "100%",
//                       padding: "10px 14px",
//                       borderRadius: 10,
//                       border: "1.5px solid #ddd",
//                       fontSize: 14,
//                       boxSizing: "border-box",
//                     }}
//                   />
//                 </div>

//                 <div className="action-buttons" style={{ display: "flex", gap: "15px" }}>
//                   <button
//                     className="add-btn"
//                     onClick={() => {
//                       setShowForm(true);
//                       setEditingProduct(null);
//                       setFormData({ name: "", category: "", stock: "", price: "", sku: "", description: "" });
//                       setProductImage(null);
//                       setImagePreview(null);
//                     }}
//                   >
//                     ➕ Add Product
//                   </button>
//                   <button className="import-btn" onClick={handleExportExcel}>
//                     📤 Import Excel
//                   </button>
//                 </div>
//               </div>

//               {/* ✅ Shows how many results match the search, only when searching */}
//               {productSearchQuery.trim() && (
//                 <p style={{ fontSize: 13, color: "#666", marginTop: -10, marginBottom: 15 }}>
//                   {filteredProducts.length} result{filteredProducts.length !== 1 ? "s" : ""} for
//                   &quot;{productSearchQuery}&quot;
//                 </p>
//               )}

//               <div className="admin-table">
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>Image</th>
//                       <th>SKU</th>
//                       <th>Product Name</th>
//                       <th>Category</th>
//                       <th>Stock</th>
//                       <th>Price</th>
//                       <th>Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredProducts.length === 0 ? (
//                       <tr>
//                         <td colSpan={7} style={{ textAlign: "center", padding: 20, color: "#888" }}>
//                           No products match your search
//                         </td>
//                       </tr>
//                     ) : (
//                       filteredProducts.map((p) => (
//                         <tr key={p.id}>
//                           <td>
//                             {p.image ? (
//                               <img
//                                 src={p.image}
//                                 alt={p.name}
//                                 style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 5 }}
//                               />
//                             ) : (
//                               <div
//                                 style={{
//                                   width: 50,
//                                   height: 50,
//                                   background: "#f0f0f0",
//                                   borderRadius: 5,
//                                   display: "flex",
//                                   alignItems: "center",
//                                   justifyContent: "center",
//                                   fontSize: 20,
//                                 }}
//                               >
//                                 🧴
//                               </div>
//                             )}
//                           </td>
//                           <td className="product-sku">{p.sku}</td>
//                           <td><strong>{p.name}</strong></td>
//                           <td>
//                             <span className="category-badge">{p.category}</span>
//                           </td>
//                           <td>
//                             <span className={p.stock < 5 ? "stock-low" : "stock-good"}>
//                               {p.stock}
//                             </span>
//                           </td>
//                           <td><strong>₹{p.price}</strong></td>
//                           <td>
//                             <button
//                               className="edit-btn"
//                               onClick={() => {
//                                 setEditingProduct(p);
//                                 setFormData({
//                                   name: p.name,
//                                   category: p.category,
//                                   stock: p.stock,
//                                   price: p.price,
//                                   sku: p.sku,
//                                   description: p.description || "",
//                                 });
//                                 setImagePreview(p.image);
//                                 setShowForm(true);
//                               }}
//                             >
//                               ✏️
//                             </button>
//                             <button
//                               className="delete-btn"
//                               onClick={() => handleDeleteProduct(p.id)}
//                             >
//                               🗑️
//                             </button>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {showForm && (
//               <div className="modal-overlay" onClick={() => setShowForm(false)}>
//                 <div className="modal-content wide" onClick={(e) => e.stopPropagation()}>
//                   <div className="modal-header">
//                     <h2>{editingProduct ? "Edit Product" : "Add Product"}</h2>
//                     <button className="close-modal" onClick={() => setShowForm(false)}>
//                       ✕
//                     </button>
//                   </div>
//                   <div className="modal-body">
//                     <form onSubmit={handleSaveProduct}>
//                       <input
//                         type="text"
//                         placeholder="Product Name"
//                         value={formData.name}
//                         onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                         required
//                       />

//                       <select
//                         value={formData.category}
//                         onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//                         required
//                         style={{
//                           padding: "12px",
//                           width: "100%",
//                           fontSize: "14px",
//                           marginBottom: "15px",
//                           borderRadius: "10px",
//                           border: "1.5px solid #ddd",
//                         }}
//                       >
//                         <option value="">Select Category</option>
//                         <option value="Non-Consumable">Non-Consumable</option>
//                         <option value="Consumable">Consumable</option>
//                       </select>

//                       <input
//                         type="text"
//                         placeholder="SKU"
//                         value={formData.sku}
//                         onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
//                         required
//                       />

//                       <input
//                         type="number"
//                         placeholder="Stock"
//                         value={formData.stock}
//                         onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
//                         required
//                       />

//                       <input
//                         type="number"
//                         placeholder="Price"
//                         value={formData.price}
//                         onChange={(e) => setFormData({ ...formData, price: e.target.value })}
//                         required
//                       />

//                       <textarea
//                         placeholder="Product Description"
//                         value={formData.description}
//                         onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                         rows="4"
//                         style={{
//                           width: "100%",
//                           marginBottom: 15,
//                           padding: 12,
//                           borderRadius: 10,
//                           border: "1.5px solid #ddd",
//                           fontSize: 14,
//                           fontFamily: "inherit",
//                           resize: "vertical",
//                         }}
//                       />

//                       <div style={{ marginBottom: 15 }}>
//                         <label
//                           htmlFor="product-image"
//                           style={{
//                             display: "block",
//                             marginBottom: 8,
//                             fontSize: 14,
//                             fontWeight: 600,
//                             color: "#00333d",
//                           }}
//                         >
//                           Product Image
//                         </label>
//                         <input
//                           id="product-image"
//                           type="file"
//                           accept="image/*"
//                           onChange={handleImageChange}
//                           style={{
//                             width: "100%",
//                             padding: 10,
//                             border: "1.5px solid #ddd",
//                             borderRadius: 10,
//                             fontSize: 14,
//                           }}
//                         />
//                         {imagePreview && (
//                           <div style={{ marginTop: 15, textAlign: "center" }}>
//                             <img
//                               src={imagePreview}
//                               alt="Preview"
//                               style={{
//                                 maxWidth: "100%",
//                                 maxHeight: 200,
//                                 borderRadius: 10,
//                                 border: "2px solid #f0f0f0",
//                               }}
//                             />
//                           </div>
//                         )}
//                       </div>

//                       <button type="submit">
//                         {editingProduct ? "Update Product" : "Add Product"}
//                       </button>
//                     </form>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {currentTab === "customers" && (
//           <div className="admin-content">
//             <div className="admin-card">
//               <h2>Customers & Past Orders</h2>
//               <table className="admin-table">
//                 <thead>
//                   <tr>
//                     <th>Name</th>
//                     <th>Email</th>
//                     <th>Total Orders</th>
//                     <th>Total Spent</th>
//                     <th>Last Order Date</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {customers.map((c) => (
//                     <tr key={c.email}>
//                       <td>{c.name}</td>
//                       <td>{c.email}</td>
//                       <td>{c.totalOrders}</td>
//                       <td>₹{c.totalSpent}</td>
//                       <td>{c.lastDate}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {currentTab === "settings" && (
//           <div className="admin-content">
//             <div className="admin-card">
//               <h2>⚙️ Settings</h2>
//               <p>Here you can manage profile, notifications, and system preferences.</p>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }





// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import * as XLSX from "xlsx";
// import "./AdminDashboard.css";

// export default function AdminDashboard() {
//   const navigate = useNavigate();
//   const [currentTab, setCurrentTab] = useState("dashboard");
//   const [orders, setOrders] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [editingProduct, setEditingProduct] = useState(null);
//   const [selectedStat, setSelectedStat] = useState(null);

//   // search query for the Products table
//   const [productSearchQuery, setProductSearchQuery] = useState("");
//   // search query for the Customers table
//   const [customerSearchQuery, setCustomerSearchQuery] = useState("");
//   // ✅ NEW: search query for the Orders table
//   const [orderSearchQuery, setOrderSearchQuery] = useState("");

//   const [formData, setFormData] = useState({
//     name: "",
//     category: "",
//     stock: "",
//     price: "",
//     sku: "",
//     description: "",
//   });

//   const [productImage, setProductImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);

//   useEffect(() => {
//     fetchOrders();
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const res = await fetch("/api/products");
//       const data = await res.json();
//       if (data.success) setProducts(data.products);
//     } catch (err) {
//       console.error("Error fetching products:", err);
//     }
//   };

//   const fetchOrders = async () => {
//     try {
//       const response = await fetch("/api/orders");
//       const data = await response.json();
//       if (data.success) {
//         const formatted = data.orders.map((o) => ({
//           id: o.orderId,
//           customer: o.customerName,
//           email: o.email,
//           phone: o.phone,
//           items: Array.isArray(o.items)
//             ? o.items.map((i) => i.name).join(", ")
//             : o.items,
//           total: o.totalAmount,
//           status: o.orderStatus,
//           date: new Date(o.createdAt).toLocaleDateString(),
//           address:
//             typeof o.shippingAddress === "object"
//               ? `${o.shippingAddress.address}, ${o.shippingAddress.city}, ${o.shippingAddress.state} - ${o.shippingAddress.pincode}`
//               : o.shippingAddress,
//           fullData: o,
//         }));
//         setOrders(formatted);
//       }
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setProductImage(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSaveProduct = async (e) => {
//     e.preventDefault();
//     try {
//       const formDataToSend = new FormData();
//       formDataToSend.append("name", formData.name);
//       formDataToSend.append("category", formData.category);
//       formDataToSend.append("price", formData.price);
//       formDataToSend.append("stock", formData.stock);
//       formDataToSend.append("sku", formData.sku);
//       formDataToSend.append("description", formData.description);

//       if (productImage) {
//         formDataToSend.append("image", productImage);
//       }

//       const url = editingProduct
//         ? `/api/products/${editingProduct.id}`
//         : "/api/products";
//       const method = editingProduct ? "PUT" : "POST";

//       const res = await fetch(url, {
//         method,
//         body: formDataToSend,
//       });

//       const data = await res.json();
//       if (data.success) {
//         alert(editingProduct ? "✅ Product updated!" : "✅ Product added!");
//         setShowForm(false);
//         setEditingProduct(null);
//         setFormData({ name: "", category: "", stock: "", price: "", sku: "", description: "" });
//         setProductImage(null);
//         setImagePreview(null);
//         fetchProducts();
//       } else alert("❌ " + data.error);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleDeleteProduct = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this product?")) return;
//     try {
//       const res = await fetch(`/api/products/${id}`, {
//         method: "DELETE",
//       });
//       const data = await res.json();
//       if (data.success) {
//         alert("🗑️ Product deleted!");
//         fetchProducts();
//       } else alert("❌ " + data.error);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const updateOrderStatus = async (orderId, newStatus) => {
//     try {
//       const res = await fetch(`/api/orders/${orderId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ orderStatus: newStatus }),
//       });
//       const result = await res.json();

//       if (result.success) {
//         setOrders((prev) =>
//           prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
//         );

//         if (selectedOrder && selectedOrder.id === orderId) {
//           setSelectedOrder({ ...selectedOrder, status: newStatus });
//         }

//         alert("✅ Order status updated successfully!");
//       } else {
//         alert("❌ " + (result.error || "Failed to update order"));
//       }
//     } catch (err) {
//       console.error("Update error:", err);
//       alert("❌ Error updating order status");
//     }
//   };

//   const handleExportExcel = async () => {
//     try {
//       const res = await fetch("/api/products");
//       const data = await res.json();

//       if (data.success && data.products.length > 0) {
//         const worksheet = XLSX.utils.json_to_sheet(
//           data.products.map((p) => ({
//             Name: p.name,
//             Category: p.category,
//             Stock: p.stock,
//             Price: p.price,
//             SKU: p.sku,
//             Description: p.description || "",
//           }))
//         );
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
//         XLSX.writeFile(workbook, "products_export.xlsx");
//         alert("✅ Excel downloaded successfully!");
//       } else {
//         alert("⚠️ No products available to export!");
//       }
//     } catch (error) {
//       console.error("Excel Export Error:", error);
//       alert("❌ Failed to export products to Excel");
//     }
//   };

//   // export the Customers table to Excel (respects the current search filter)
//   const handleExportCustomersExcel = () => {
//     if (filteredCustomers.length === 0) {
//       alert("⚠️ No customers available to export!");
//       return;
//     }
//     const worksheet = XLSX.utils.json_to_sheet(
//       filteredCustomers.map((c) => ({
//         Name: c.name,
//         Email: c.email,
//         "Total Orders": c.totalOrders,
//         "Total Spent": c.totalSpent,
//         "Last Order Date": c.lastDate,
//       }))
//     );
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");
//     XLSX.writeFile(workbook, "customers_export.xlsx");
//     alert("✅ Excel downloaded successfully!");
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   const totalOrders = orders.length;
//   const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
//   const pendingOrders = orders.filter((o) => o.status === "pending").length;
//   const lowStockItems = products.filter((p) => p.stock < 5).length;

//   const statusColors = {
//     pending: "status-pending",
//     processing: "status-processing",
//     shipped: "status-shipped",
//     delivered: "status-delivered",
//   };

//   const customers = Object.values(
//     orders.reduce((acc, o) => {
//       if (!acc[o.customer]) {
//         acc[o.customer] = {
//           name: o.customer,
//           email: o.email,
//           totalOrders: 0,
//           totalSpent: 0,
//           lastDate: o.date,
//         };
//       }
//       acc[o.customer].totalOrders += 1;
//       acc[o.customer].totalSpent += o.total;
//       acc[o.customer].lastDate = o.date;
//       return acc;
//     }, {})
//   );

//   const getFilteredData = () => {
//     if (selectedStat === "pending")
//       return orders.filter((o) => o.status === "pending");
//     if (selectedStat === "lowstock") return products.filter((p) => p.stock < 5);
//     if (selectedStat === "orders") return orders;
//     return [];
//   };

//   // products filtered by the search box (matches name or SKU)
//   const filteredProducts = products.filter((p) => {
//     const query = productSearchQuery.trim().toLowerCase();
//     if (!query) return true;
//     return (
//       p.name?.toLowerCase().includes(query) ||
//       p.sku?.toString().toLowerCase().includes(query)
//     );
//   });

//   // customers filtered by the search box (matches name or email)
//   const filteredCustomers = customers.filter((c) => {
//     const query = customerSearchQuery.trim().toLowerCase();
//     if (!query) return true;
//     return (
//       c.name?.toLowerCase().includes(query) ||
//       c.email?.toLowerCase().includes(query)
//     );
//   });

//   // ✅ NEW: orders filtered by the search box (matches order ID, customer name, or items)
//   const filteredOrders = orders.filter((o) => {
//     const query = orderSearchQuery.trim().toLowerCase();
//     if (!query) return true;
//     return (
//       o.id?.toLowerCase().includes(query) ||
//       o.customer?.toLowerCase().includes(query) ||
//       o.items?.toLowerCase().includes(query)
//     );
//   });

//   return (
//     <div className="admin-dashboard">
//       <aside className="admin-sidebar">
//         <div className="admin-brand">
//           <div className="admin-logo">
//             <img src="/MR LOGO.jpeg" alt="Logo" />
//           </div>
//           <h2>Admin Panel</h2>
//           <p>G Care Management</p>
//         </div>

//         <nav className="admin-nav">
//           {["dashboard", "orders", "products", "customers", "settings"].map((tab) => (
//             <button
//               key={tab}
//               className={`admin-nav-item ${currentTab === tab ? "active" : ""}`}
//               onClick={() => setCurrentTab(tab)}
//             >
//               {tab === "dashboard" && "📊 "}
//               {tab === "orders" && "🛒 "}
//               {tab === "products" && "📦 "}
//               {tab === "customers" && "👥 "}
//               {tab === "settings" && "⚙️ "}
//               {tab.charAt(0).toUpperCase() + tab.slice(1)}
//               {tab === "orders" && pendingOrders > 0 && (
//                 <span className="badge">{pendingOrders}</span>
//               )}
//             </button>
//           ))}
//         </nav>

//         <button className="admin-logout" onClick={handleLogout}>
//           🚪 Logout
//         </button>
//       </aside>

//       <main className="admin-main">
//         <header className="admin-header">
//           <div>
//             <h1>{currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}</h1>
//             <p>Welcome back, Admin</p>
//           </div>
//           <div className="admin-user">
//             <span>🔔</span>
//             <div className="admin-avatar">A</div>
//           </div>
//         </header>

//         {currentTab === "dashboard" && (
//           <div className="admin-content">
//             <div className="stats-grid">
//               <div className="stat-card card-blue" onClick={() => setSelectedStat("orders")}>
//                 <h3>Total Orders</h3>
//                 <p>{totalOrders}</p>
//               </div>
//               <div className="stat-card card-green">
//                 <h3>Total Revenue</h3>
//                 <p>₹{totalRevenue.toLocaleString()}</p>
//               </div>
//               <div className="stat-card card-yellow" onClick={() => setSelectedStat("pending")}>
//                 <h3>Pending Orders</h3>
//                 <p>{pendingOrders}</p>
//               </div>
//               <div className="stat-card card-red" onClick={() => setSelectedStat("lowstock")}>
//                 <h3>Low Stock Items</h3>
//                 <p>{lowStockItems}</p>
//               </div>
//             </div>

//             {selectedStat && (
//               <div className="admin-card">
//                 <h2>
//                   {selectedStat === "orders"
//                     ? "All Orders"
//                     : selectedStat === "pending"
//                     ? "Pending Orders"
//                     : "Low Stock Products"}
//                 </h2>
//                 {selectedStat === "lowstock" ? (
//                   <table className="admin-table">
//                     <thead>
//                       <tr>
//                         <th>SKU</th>
//                         <th>Name</th>
//                         <th>Stock</th>
//                         <th>Price</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {getFilteredData().map((p) => (
//                         <tr key={p.id}>
//                           <td>{p.sku}</td>
//                           <td>{p.name}</td>
//                           <td>{p.stock}</td>
//                           <td>₹{p.price}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 ) : (
//                   <table className="admin-table">
//                     <thead>
//                       <tr>
//                         <th>Order ID</th>
//                         <th>Customer</th>
//                         <th>Total</th>
//                         <th>Status</th>
//                         <th>Date</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {getFilteredData().map((o) => (
//                         <tr key={o.id}>
//                           <td>{o.id}</td>
//                           <td>{o.customer}</td>
//                           <td>₹{o.total}</td>
//                           <td>
//                             <span className={`status-badge ${statusColors[o.status]}`}>
//                               {o.status}
//                             </span>
//                           </td>
//                           <td>{o.date}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 )}
//               </div>
//             )}
//           </div>
//         )}

//         {currentTab === "orders" && (
//           <div className="admin-content">
//             <div className="admin-card">
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   marginBottom: "20px",
//                   gap: "15px",
//                   flexWrap: "wrap",
//                 }}
//               >
//                 <h2 style={{ margin: 0 }}>All Orders</h2>

//                 {/* ✅ NEW: search box — filters by Order ID, customer name, or items */}
//                 <div style={{ flex: "1 1 260px", maxWidth: 320 }}>
//                   <input
//                     type="text"
//                     placeholder="🔍 Search by order ID, customer, item..."
//                     value={orderSearchQuery}
//                     onChange={(e) => setOrderSearchQuery(e.target.value)}
//                     style={{
//                       width: "100%",
//                       padding: "10px 14px",
//                       borderRadius: 10,
//                       border: "1.5px solid #ddd",
//                       fontSize: 14,
//                       boxSizing: "border-box",
//                     }}
//                   />
//                 </div>
//               </div>

//               {orderSearchQuery.trim() && (
//                 <p style={{ fontSize: 13, color: "#666", marginTop: -10, marginBottom: 15 }}>
//                   {filteredOrders.length} result{filteredOrders.length !== 1 ? "s" : ""} for
//                   &quot;{orderSearchQuery}&quot;
//                 </p>
//               )}

//               {loading ? (
//                 <p>Loading...</p>
//               ) : orders.length === 0 ? (
//                 <p>No orders yet</p>
//               ) : (
//                 <table className="admin-table">
//                   <thead>
//                     <tr>
//                       <th>Order ID</th>
//                       <th>Customer</th>
//                       <th>Items</th>
//                       <th>Total</th>
//                       <th>Status</th>
//                       <th>Date</th>
//                       <th>Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredOrders.length === 0 ? (
//                       <tr>
//                         <td colSpan={7} style={{ textAlign: "center", padding: 20, color: "#888" }}>
//                           No orders match your search
//                         </td>
//                       </tr>
//                     ) : (
//                       filteredOrders.map((o) => (
//                         <tr key={o.id}>
//                           <td>{o.id}</td>
//                           <td>{o.customer}</td>
//                           <td>{o.items}</td>
//                           <td>₹{o.total}</td>
//                           <td>
//                             <span className={`status-badge ${statusColors[o.status]}`}>
//                               {o.status}
//                             </span>
//                           </td>
//                           <td>{o.date}</td>
//                           <td>
//                             <button onClick={() => setSelectedOrder(o)}>👁 View</button>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               )}
//             </div>

//             {selectedOrder && (
//               <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
//                 <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
//                   <div className="modal-header">
//                     <h2>Order Details</h2>
//                     <button className="close-modal" onClick={() => setSelectedOrder(null)}>
//                       ✕
//                     </button>
//                   </div>
//                   <div className="modal-body">
//                     <div className="detail-section">
//                       <h3>👤 Customer Info</h3>
//                       <p><strong>Name:</strong> {selectedOrder.customer}</p>
//                       <p><strong>Email:</strong> {selectedOrder.email}</p>
//                       <p><strong>Phone:</strong> {selectedOrder.phone}</p>
//                     </div>
//                     <div className="detail-section">
//                       <h3>📍 Address</h3>
//                       <p>{selectedOrder.address}</p>
//                     </div>
//                     <div className="detail-section">
//                       <h3>📦 Items</h3>
//                       <p>{selectedOrder.items}</p>
//                       <p><strong>Total:</strong> ₹{selectedOrder.total}</p>
//                     </div>
//                     <div className="detail-section">
//                       <h3>Update Status</h3>
//                       <div className="status-buttons">
//                         {["pending", "processing", "shipped", "delivered"].map((s) => (
//                           <button
//                             key={s}
//                             className={`status-update-btn ${
//                               selectedOrder.status === s ? "active" : ""
//                             }`}
//                             onClick={() => updateOrderStatus(selectedOrder.id, s)}
//                           >
//                             {s}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="modal-footer">
//                     <button className="print-btn">🖨 Print Invoice</button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {currentTab === "products" && (
//           <div className="admin-content">
//             <div className="admin-card">
//               <div
//                 className="card-header"
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   marginBottom: "20px",
//                   gap: "15px",
//                   flexWrap: "wrap",
//                 }}
//               >
//                 <h2>Products Management</h2>

//                 <div style={{ flex: "1 1 260px", maxWidth: 320 }}>
//                   <input
//                     type="text"
//                     placeholder="🔍 Search by name or SKU..."
//                     value={productSearchQuery}
//                     onChange={(e) => setProductSearchQuery(e.target.value)}
//                     style={{
//                       width: "100%",
//                       padding: "10px 14px",
//                       borderRadius: 10,
//                       border: "1.5px solid #ddd",
//                       fontSize: 14,
//                       boxSizing: "border-box",
//                     }}
//                   />
//                 </div>

//                 <div className="action-buttons" style={{ display: "flex", gap: "15px" }}>
//                   <button
//                     className="add-btn"
//                     onClick={() => {
//                       setShowForm(true);
//                       setEditingProduct(null);
//                       setFormData({ name: "", category: "", stock: "", price: "", sku: "", description: "" });
//                       setProductImage(null);
//                       setImagePreview(null);
//                     }}
//                   >
//                     ➕ Add Product
//                   </button>
//                   <button className="import-btn" onClick={handleExportExcel}>
//                     📤 Import Excel
//                   </button>
//                 </div>
//               </div>

//               {productSearchQuery.trim() && (
//                 <p style={{ fontSize: 13, color: "#666", marginTop: -10, marginBottom: 15 }}>
//                   {filteredProducts.length} result{filteredProducts.length !== 1 ? "s" : ""} for
//                   &quot;{productSearchQuery}&quot;
//                 </p>
//               )}

//               <div className="admin-table">
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>Image</th>
//                       <th>SKU</th>
//                       <th>Product Name</th>
//                       <th>Category</th>
//                       <th>Stock</th>
//                       <th>Price</th>
//                       <th>Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredProducts.length === 0 ? (
//                       <tr>
//                         <td colSpan={7} style={{ textAlign: "center", padding: 20, color: "#888" }}>
//                           No products match your search
//                         </td>
//                       </tr>
//                     ) : (
//                       filteredProducts.map((p) => (
//                         <tr key={p.id}>
//                           <td>
//                             {p.image ? (
//                               <img
//                                 src={p.image}
//                                 alt={p.name}
//                                 style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 5 }}
//                               />
//                             ) : (
//                               <div
//                                 style={{
//                                   width: 50,
//                                   height: 50,
//                                   background: "#f0f0f0",
//                                   borderRadius: 5,
//                                   display: "flex",
//                                   alignItems: "center",
//                                   justifyContent: "center",
//                                   fontSize: 20,
//                                 }}
//                               >
//                                 🧴
//                               </div>
//                             )}
//                           </td>
//                           <td className="product-sku">{p.sku}</td>
//                           <td><strong>{p.name}</strong></td>
//                           <td>
//                             <span className="category-badge">{p.category}</span>
//                           </td>
//                           <td>
//                             <span className={p.stock < 5 ? "stock-low" : "stock-good"}>
//                               {p.stock}
//                             </span>
//                           </td>
//                           <td><strong>₹{p.price}</strong></td>
//                           <td>
//                             <button
//                               className="edit-btn"
//                               onClick={() => {
//                                 setEditingProduct(p);
//                                 setFormData({
//                                   name: p.name,
//                                   category: p.category,
//                                   stock: p.stock,
//                                   price: p.price,
//                                   sku: p.sku,
//                                   description: p.description || "",
//                                 });
//                                 setImagePreview(p.image);
//                                 setShowForm(true);
//                               }}
//                             >
//                               ✏️
//                             </button>
//                             <button
//                               className="delete-btn"
//                               onClick={() => handleDeleteProduct(p.id)}
//                             >
//                               🗑️
//                             </button>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {showForm && (
//               <div className="modal-overlay" onClick={() => setShowForm(false)}>
//                 <div className="modal-content wide" onClick={(e) => e.stopPropagation()}>
//                   <div className="modal-header">
//                     <h2>{editingProduct ? "Edit Product" : "Add Product"}</h2>
//                     <button className="close-modal" onClick={() => setShowForm(false)}>
//                       ✕
//                     </button>
//                   </div>
//                   <div className="modal-body">
//                     <form onSubmit={handleSaveProduct}>
//                       <input
//                         type="text"
//                         placeholder="Product Name"
//                         value={formData.name}
//                         onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                         required
//                       />

//                       <select
//                         value={formData.category}
//                         onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//                         required
//                         style={{
//                           padding: "12px",
//                           width: "100%",
//                           fontSize: "14px",
//                           marginBottom: "15px",
//                           borderRadius: "10px",
//                           border: "1.5px solid #ddd",
//                         }}
//                       >
//                         <option value="">Select Category</option>
//                         <option value="Non-Consumable">Non-Consumable</option>
//                         <option value="Consumable">Consumable</option>
//                       </select>

//                       <input
//                         type="text"
//                         placeholder="SKU"
//                         value={formData.sku}
//                         onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
//                         required
//                       />

//                       <input
//                         type="number"
//                         placeholder="Stock"
//                         value={formData.stock}
//                         onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
//                         required
//                       />

//                       <input
//                         type="number"
//                         placeholder="Price"
//                         value={formData.price}
//                         onChange={(e) => setFormData({ ...formData, price: e.target.value })}
//                         required
//                       />

//                       <textarea
//                         placeholder="Product Description"
//                         value={formData.description}
//                         onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                         rows="4"
//                         style={{
//                           width: "100%",
//                           marginBottom: 15,
//                           padding: 12,
//                           borderRadius: 10,
//                           border: "1.5px solid #ddd",
//                           fontSize: 14,
//                           fontFamily: "inherit",
//                           resize: "vertical",
//                         }}
//                       />

//                       <div style={{ marginBottom: 15 }}>
//                         <label
//                           htmlFor="product-image"
//                           style={{
//                             display: "block",
//                             marginBottom: 8,
//                             fontSize: 14,
//                             fontWeight: 600,
//                             color: "#00333d",
//                           }}
//                         >
//                           Product Image
//                         </label>
//                         <input
//                           id="product-image"
//                           type="file"
//                           accept="image/*"
//                           onChange={handleImageChange}
//                           style={{
//                             width: "100%",
//                             padding: 10,
//                             border: "1.5px solid #ddd",
//                             borderRadius: 10,
//                             fontSize: 14,
//                           }}
//                         />
//                         {imagePreview && (
//                           <div style={{ marginTop: 15, textAlign: "center" }}>
//                             <img
//                               src={imagePreview}
//                               alt="Preview"
//                               style={{
//                                 maxWidth: "100%",
//                                 maxHeight: 200,
//                                 borderRadius: 10,
//                                 border: "2px solid #f0f0f0",
//                               }}
//                             />
//                           </div>
//                         )}
//                       </div>

//                       <button type="submit">
//                         {editingProduct ? "Update Product" : "Add Product"}
//                       </button>
//                     </form>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {currentTab === "customers" && (
//           <div className="admin-content">
//             <div className="admin-card">
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   marginBottom: "20px",
//                   gap: "15px",
//                   flexWrap: "wrap",
//                 }}
//               >
//                 <h2 style={{ margin: 0 }}>Customers & Past Orders</h2>

//                 <div style={{ flex: "1 1 260px", maxWidth: 320 }}>
//                   <input
//                     type="text"
//                     placeholder="🔍 Search by name or email..."
//                     value={customerSearchQuery}
//                     onChange={(e) => setCustomerSearchQuery(e.target.value)}
//                     style={{
//                       width: "100%",
//                       padding: "10px 14px",
//                       borderRadius: 10,
//                       border: "1.5px solid #ddd",
//                       fontSize: 14,
//                       boxSizing: "border-box",
//                     }}
//                   />
//                 </div>

//                 <button className="import-btn" onClick={handleExportCustomersExcel}>
//                   📤 Download Excel
//                 </button>
//               </div>

//               {customerSearchQuery.trim() && (
//                 <p style={{ fontSize: 13, color: "#666", marginTop: -10, marginBottom: 15 }}>
//                   {filteredCustomers.length} result{filteredCustomers.length !== 1 ? "s" : ""} for
//                   &quot;{customerSearchQuery}&quot;
//                 </p>
//               )}

//               <table className="admin-table">
//                 <thead>
//                   <tr>
//                     <th>Name</th>
//                     <th>Email</th>
//                     <th>Total Orders</th>
//                     <th>Total Spent</th>
//                     <th>Last Order Date</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredCustomers.length === 0 ? (
//                     <tr>
//                       <td colSpan={5} style={{ textAlign: "center", padding: 20, color: "#888" }}>
//                         No customers match your search
//                       </td>
//                     </tr>
//                   ) : (
//                     filteredCustomers.map((c) => (
//                       <tr key={c.email}>
//                         <td>{c.name}</td>
//                         <td>{c.email}</td>
//                         <td>{c.totalOrders}</td>
//                         <td>₹{c.totalSpent}</td>
//                         <td>{c.lastDate}</td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {currentTab === "settings" && (
//           <div className="admin-content">
//             <div className="admin-card">
//               <h2>⚙️ Settings</h2>
//               <p>Here you can manage profile, notifications, and system preferences.</p>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }






import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import {
  FaChartPie, FaBoxOpen, FaShoppingCart, FaUsers, FaBuilding, FaSignOutAlt,
  FaRupeeSign, FaClock, FaExclamationTriangle, FaSyncAlt, FaArrowUp, FaArrowDown,
  FaBell, FaCubes,
} from "react-icons/fa";
import { RevenueTrend, StatusMix, TopProducts, Sparkline, STATUS_COLORS } from "./AdminCharts";
import { downloadOrderPdf } from "./orderPdf";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  // order pending deletion; the confirm dialog is driven off this
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedStat, setSelectedStat] = useState(null);

  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [orderSearchQuery, setOrderSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    stock: "",
    price: "",
    sku: "",
    description: "",
  });

  const [productImage, setProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // ✅ NEW: current logged-in admin's own info (from localStorage, set at login)
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isSuperAdmin = currentUser.isSuperAdmin === true;

  // ✅ NEW: Companies tab state
  const [companies, setCompanies] = useState([]);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [companyFormData, setCompanyFormData] = useState({
    companyName: "",
    companyId: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [companySearchQuery, setCompanySearchQuery] = useState("");

  // live refresh: re-poll the same endpoints on an interval so the numbers
  // track the backend without a manual reload
  const [lastSync, setLastSync] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [revenueRange, setRevenueRange] = useState(14); // days shown in the trend
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile nav drawer

  // ✅ NEW: every admin API call must carry the JWT so the backend can scope
  // data to this admin's company (or bypass scoping for the super admin).
  const authFetch = (url, options = {}) => {
    const token = localStorage.getItem("token");
    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
    if (isSuperAdmin) fetchCompanies();
    setLastSync(new Date());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-pull orders/products. Used by the Refresh button and the poll timer;
  // it never touches the CRUD flows.
  const refreshData = useCallback(
    async (silent = false) => {
      if (!silent) setRefreshing(true);
      try {
        await Promise.all([fetchOrders(), fetchProducts()]);
        setLastSync(new Date());
      } finally {
        if (!silent) setRefreshing(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Poll every 30s while the tab is visible and auto-refresh is on.
  useEffect(() => {
    if (!autoRefresh) return undefined;
    const tick = () => {
      if (document.visibilityState === "visible") refreshData(true);
    };
    const id = setInterval(tick, 30000);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [autoRefresh, refreshData]);

  // ✅ CHANGED: now hits the company-scoped admin endpoint (not the public
  // storefront one), and sends the auth token.
  const fetchProducts = async () => {
    try {
      const res = await authFetch("/api/admin/products");
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // ✅ CHANGED: now sends the auth token — /api/orders requires admin login
  const fetchOrders = async () => {
    try {
      const response = await authFetch("/api/orders");
      const data = await response.json();
      if (data.success) {
        const formatted = data.orders.map((o) => ({
          id: o.orderId,
          companyId: o.companyId,
          customer: o.customerName,
          email: o.email,
          phone: o.phone,
          items: Array.isArray(o.items)
            ? o.items.map((i) => i.name).join(", ")
            : o.items,
          total: o.totalAmount,
          status: o.orderStatus,
          date: new Date(o.createdAt).toLocaleDateString(),
          address:
            typeof o.shippingAddress === "object"
              ? `${o.shippingAddress.address}, ${o.shippingAddress.city}, ${o.shippingAddress.state} - ${o.shippingAddress.pincode}`
              : o.shippingAddress,
          fullData: o,
        }));
        setOrders(formatted);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: fetch the list of company admin accounts (super admin only)
  const fetchCompanies = async () => {
    try {
      const res = await authFetch("/api/auth/admin/companies");
      const data = await res.json();
      if (data.success) setCompanies(data.companies);
    } catch (err) {
      console.error("Error fetching companies:", err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("stock", formData.stock);
      formDataToSend.append("sku", formData.sku);
      formDataToSend.append("description", formData.description);

      if (productImage) {
        formDataToSend.append("image", productImage);
      }

      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : "/api/products";
      const method = editingProduct ? "PUT" : "POST";

      // ✅ CHANGED: uses authFetch so the auth token is attached
      const res = await authFetch(url, {
        method,
        body: formDataToSend,
      });

      const data = await res.json();
      if (data.success) {
        alert(editingProduct ? "✅ Product updated!" : "✅ Product added!");
        setShowForm(false);
        setEditingProduct(null);
        setFormData({ name: "", category: "", stock: "", price: "", sku: "", description: "" });
        setProductImage(null);
        setImagePreview(null);
        fetchProducts();
      } else alert("❌ " + data.error);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      // ✅ CHANGED: authFetch
      const res = await authFetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        alert("🗑️ Product deleted!");
        fetchProducts();
      } else alert("❌ " + data.error);
    } catch (err) {
      console.error(err);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // ✅ CHANGED: authFetch
      const res = await authFetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      const result = await res.json();

      if (result.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );

        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }

        alert("✅ Order status updated successfully!");
      } else {
        alert("❌ " + (result.error || "Failed to update order"));
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("❌ Error updating order status");
    }
  };

  const handleExportExcel = async () => {
    try {
      const res = await authFetch("/api/admin/products");
      const data = await res.json();

      if (data.success && data.products.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(
          data.products.map((p) => ({
            Name: p.name,
            Category: p.category,
            Stock: p.stock,
            Price: p.price,
            SKU: p.sku,
            Description: p.description || "",
          }))
        );
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
        XLSX.writeFile(workbook, "products_export.xlsx");
        alert("✅ Excel downloaded successfully!");
      } else {
        alert("⚠️ No products available to export!");
      }
    } catch (error) {
      console.error("Excel Export Error:", error);
      alert("❌ Failed to export products to Excel");
    }
  };

  const handleExportCustomersExcel = () => {
    if (filteredCustomers.length === 0) {
      alert("⚠️ No customers available to export!");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(
      filteredCustomers.map((c) => ({
        Name: c.name,
        Email: c.email,
        "Total Orders": c.totalOrders,
        "Total Spent": c.totalSpent,
        "Last Order Date": c.lastDate,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");
    XLSX.writeFile(workbook, "customers_export.xlsx");
    alert("✅ Excel downloaded successfully!");
  };

  // ✅ NEW: creates a new company + its admin account (super admin only)
  const handleCreateCompany = async (e) => {
    e.preventDefault();
    try {
      const res = await authFetch("/api/auth/admin/create-company-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companyFormData),
      });
      const data = await res.json();
      if (data.success) {
        alert(`✅ ${data.message}`);
        setShowCompanyForm(false);
        setCompanyFormData({
          companyName: "",
          companyId: "",
          fullName: "",
          email: "",
          phone: "",
          password: "",
        });
        fetchCompanies();
      } else {
        alert("❌ " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error creating company admin");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const lowStockItems = products.filter((p) => p.stock < 5).length;

  // ---- dashboard analytics, derived from the live orders/products ----
  const analytics = useMemo(() => {
    const dayKey = (d) => d.toISOString().slice(0, 10);
    const days = [];
    for (let i = revenueRange - 1; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      days.push(d);
    }
    const buckets = new Map(days.map((d) => [dayKey(d), { value: 0, count: 0 }]));

    let prevWindow = 0;
    const windowStart = days[0];
    const prevStart = new Date(windowStart);
    prevStart.setDate(prevStart.getDate() - revenueRange);

    orders.forEach((o) => {
      const raw = o.fullData?.createdAt;
      if (!raw) return;
      const when = new Date(raw);
      if (Number.isNaN(when.getTime())) return;
      const k = dayKey(when);
      if (buckets.has(k)) {
        const bucket = buckets.get(k);
        bucket.value += o.total || 0;
        bucket.count += 1;
      } else if (when >= prevStart && when < windowStart) {
        prevWindow += o.total || 0;
      }
    });

    const trend = days.map((d) => ({
      label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      value: buckets.get(dayKey(d)).value,
      count: buckets.get(dayKey(d)).count,
    }));

    const windowRevenue = trend.reduce((sum, t) => sum + t.value, 0);
    const revenueDelta =
      prevWindow > 0 ? Math.round(((windowRevenue - prevWindow) / prevWindow) * 100) : null;

    const statusCounts = orders.reduce((acc, o) => {
      const k = (o.status || "pending").toLowerCase();
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});

    // units sold per product name, taken from the order line items
    const unitsByProduct = {};
    orders.forEach((o) => {
      const items = o.fullData?.items;
      if (!Array.isArray(items)) return;
      items.forEach((it) => {
        const name = it.name || "Unknown";
        unitsByProduct[name] = (unitsByProduct[name] || 0) + (Number(it.quantity) || 1);
      });
    });
    const topProducts = Object.entries(unitsByProduct)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    const stockValue = products.reduce(
      (sum, p) => sum + (Number(p.price) || 0) * (Number(p.stock) || 0),
      0
    );
    const outOfStock = products.filter((p) => Number(p.stock) === 0).length;
    const customerCount = new Set(orders.map((o) => o.email || o.customer)).size;
    const avgOrder = orders.length
      ? Math.round(orders.reduce((sum, o) => sum + (o.total || 0), 0) / orders.length)
      : 0;

    return {
      trend,
      sparkRevenue: trend.map((t) => t.value),
      sparkOrders: trend.map((t) => t.count),
      windowRevenue,
      revenueDelta,
      statusCounts,
      topProducts,
      stockValue,
      outOfStock,
      customerCount,
      avgOrder,
      recentOrders: [...orders]
        .sort(
          (a, b) =>
            new Date(b.fullData?.createdAt || 0) - new Date(a.fullData?.createdAt || 0)
        )
        .slice(0, 6),
      lowStockList: products
        .filter((p) => Number(p.stock) < 5)
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 6),
    };
  }, [orders, products, revenueRange]);


  const statusColors = {
    pending: "status-pending",
    processing: "status-processing",
    shipped: "status-shipped",
    delivered: "status-delivered",
  };

  const customers = Object.values(
    orders.reduce((acc, o) => {
      if (!acc[o.customer]) {
        acc[o.customer] = {
          name: o.customer,
          email: o.email,
          totalOrders: 0,
          totalSpent: 0,
          lastDate: o.date,
        };
      }
      acc[o.customer].totalOrders += 1;
      acc[o.customer].totalSpent += o.total;
      acc[o.customer].lastDate = o.date;
      return acc;
    }, {})
  );

  const handleDownloadOrderPdf = async (order) => {
    try {
      await downloadOrderPdf(order);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Could not generate the PDF for this order.");
    }
  };

  const handleDeleteOrder = async () => {
    if (!orderToDelete || deleting) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderToDelete.id)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        // drop it locally so the table updates without a full refetch
        setOrders((prev) => prev.filter((o) => o.id !== orderToDelete.id));
        if (selectedOrder?.id === orderToDelete.id) setSelectedOrder(null);
        setOrderToDelete(null);
      } else {
        alert(data.error || "Could not delete this order.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const getFilteredData = () => {
    if (selectedStat === "pending")
      return orders.filter((o) => o.status === "pending");
    if (selectedStat === "lowstock") return products.filter((p) => p.stock < 5);
    if (selectedStat === "orders") return orders;
    return [];
  };

  const filteredProducts = products.filter((p) => {
    const query = productSearchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      p.name?.toLowerCase().includes(query) ||
      p.sku?.toString().toLowerCase().includes(query)
    );
  });

  const filteredCustomers = customers.filter((c) => {
    const query = customerSearchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      c.name?.toLowerCase().includes(query) ||
      c.email?.toLowerCase().includes(query)
    );
  });

  const filteredOrders = orders.filter((o) => {
    const query = orderSearchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      o.id?.toLowerCase().includes(query) ||
      o.customer?.toLowerCase().includes(query) ||
      o.items?.toLowerCase().includes(query)
    );
  });

  // ✅ NEW: companies filtered by search box
  const filteredCompanies = companies.filter((c) => {
    const query = companySearchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      c.companyName?.toLowerCase().includes(query) ||
      c.email?.toLowerCase().includes(query) ||
      c.companyId?.toLowerCase().includes(query)
    );
  });

  // ✅ NEW: sidebar tabs — "Companies" only shows up for the super admin
  const tabs = ["dashboard", "orders", "products", "customers", "settings"];
  if (isSuperAdmin) tabs.splice(4, 0, "companies");

  const tabIcons = {
    dashboard: <FaChartPie />,
    orders: <FaShoppingCart />,
    products: <FaBoxOpen />,
    customers: <FaUsers />,
    companies: <FaBuilding />,
    settings: <FaCubes />,
  };

  return (
    <div className={`admin-dashboard${sidebarOpen ? " nav-open" : ""}`}>
      <button
        type="button"
        className="admin-nav-toggle"
        onClick={() => setSidebarOpen((v) => !v)}
        aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        aria-expanded={sidebarOpen}
      >
        <span /><span /><span />
      </button>
      {sidebarOpen && (
        <div className="admin-nav-scrim" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      )}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-logo">
            <img src="/MR LOGO.jpeg" alt="Logo" />
          </div>
          <h2>Admin Panel</h2>
          <p>{currentUser.companyName || "G Care Management"}</p>
        </div>

        <nav className="admin-nav">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`admin-nav-item ${currentTab === tab ? "active" : ""}`}
              onClick={() => {
                setCurrentTab(tab);
                setSidebarOpen(false);
              }}
            >
              <span className="admin-nav-icon">{tabIcons[tab]}</span>
              <span className="admin-nav-label">
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </span>
              {tab === "orders" && pendingOrders > 0 && (
                <span className="badge">{pendingOrders}</span>
              )}
            </button>
          ))}
        </nav>

        <button className="admin-logout" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>{currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}</h1>
            <p>Welcome back, {currentUser.fullName || "Admin"}</p>
          </div>
          <div className="admin-user">
            <button type="button" className="admin-bell" aria-label={`${pendingOrders} pending orders`}>
              <FaBell />
              {pendingOrders > 0 && <span className="admin-bell-dot" />}
            </button>
            <div className="admin-avatar">
              {(currentUser.fullName || "Admin").trim().charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {currentTab === "dashboard" && (
          <div className="admin-content">
            {/* live status strip */}
            <div className="dash-toolbar">
              <span className={`live-dot${autoRefresh ? " is-live" : ""}`} aria-hidden="true" />
              <span className="dash-live-text">
                {autoRefresh ? "Live" : "Paused"}
                {lastSync && (
                  <small>
                    updated{" "}
                    {lastSync.toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </small>
                )}
              </span>
              <div className="dash-toolbar-actions">
                <button
                  type="button"
                  className={`dash-chip${autoRefresh ? " is-active" : ""}`}
                  onClick={() => setAutoRefresh((v) => !v)}
                  title="Toggle 30s auto-refresh"
                >
                  Auto-refresh
                </button>
                <button
                  type="button"
                  className={`dash-refresh${refreshing ? " is-busy" : ""}`}
                  onClick={() => refreshData(false)}
                  disabled={refreshing}
                >
                  <FaSyncAlt /> {refreshing ? "Refreshing…" : "Refresh"}
                </button>
              </div>
            </div>

            {/* KPI row */}
            <div className="stats-grid">
              <button
                type="button"
                className="stat-card card-blue"
                onClick={() => setSelectedStat(selectedStat === "orders" ? null : "orders")}
              >
                <div className="stat-top">
                  <span className="stat-icon"><FaShoppingCart /></span>
                  <h3>Total Orders</h3>
                </div>
                <p>{totalOrders}</p>
                <div className="stat-foot">
                  <Sparkline points={analytics.sparkOrders} color="#0EA5E9" />
                  <span className="stat-sub">{analytics.customerCount} customers</span>
                </div>
              </button>

              <div className="stat-card card-green">
                <div className="stat-top">
                  <span className="stat-icon"><FaRupeeSign /></span>
                  <h3>Total Revenue</h3>
                </div>
                <p>₹{totalRevenue.toLocaleString("en-IN")}</p>
                <div className="stat-foot">
                  <Sparkline points={analytics.sparkRevenue} color="#10B981" />
                  {analytics.revenueDelta !== null ? (
                    <span className={`stat-delta ${analytics.revenueDelta >= 0 ? "up" : "down"}`}>
                      {analytics.revenueDelta >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                      {Math.abs(analytics.revenueDelta)}%
                    </span>
                  ) : (
                    <span className="stat-sub">avg ₹{analytics.avgOrder.toLocaleString("en-IN")}</span>
                  )}
                </div>
              </div>

              <button
                type="button"
                className="stat-card card-yellow"
                onClick={() => setSelectedStat(selectedStat === "pending" ? null : "pending")}
              >
                <div className="stat-top">
                  <span className="stat-icon"><FaClock /></span>
                  <h3>Pending Orders</h3>
                </div>
                <p>{pendingOrders}</p>
                <div className="stat-foot">
                  <span className="stat-sub">
                    {totalOrders ? Math.round((pendingOrders / totalOrders) * 100) : 0}% of all orders
                  </span>
                </div>
              </button>

              <button
                type="button"
                className="stat-card card-red"
                onClick={() => setSelectedStat(selectedStat === "lowstock" ? null : "lowstock")}
              >
                <div className="stat-top">
                  <span className="stat-icon"><FaExclamationTriangle /></span>
                  <h3>Low Stock Items</h3>
                </div>
                <p>{lowStockItems}</p>
                <div className="stat-foot">
                  <span className="stat-sub">{analytics.outOfStock} out of stock</span>
                </div>
              </button>

              <div className="stat-card card-teal">
                <div className="stat-top">
                  <span className="stat-icon"><FaCubes /></span>
                  <h3>Stock Value</h3>
                </div>
                <p>₹{analytics.stockValue.toLocaleString("en-IN")}</p>
                <div className="stat-foot">
                  <span className="stat-sub">{products.length} products</span>
                </div>
              </div>
            </div>

            {/* charts */}
            <div className="dash-grid">
              <section className="admin-card dash-panel dash-panel--wide">
                <header className="dash-panel-head">
                  <div>
                    <h2>Revenue trend</h2>
                    <p>Daily order value over the last {revenueRange} days</p>
                  </div>
                  <div className="dash-range" role="tablist" aria-label="Range">
                    {[7, 14, 30].map((d) => (
                      <button
                        key={d}
                        type="button"
                        role="tab"
                        aria-selected={revenueRange === d}
                        className={revenueRange === d ? "is-active" : ""}
                        onClick={() => setRevenueRange(d)}
                      >
                        {d}d
                      </button>
                    ))}
                  </div>
                </header>
                <RevenueTrend data={analytics.trend} />
              </section>

              <section className="admin-card dash-panel">
                <header className="dash-panel-head">
                  <div>
                    <h2>Order status</h2>
                    <p>{totalOrders} orders in total</p>
                  </div>
                </header>
                <StatusMix counts={analytics.statusCounts} total={totalOrders} />
              </section>

              <section className="admin-card dash-panel">
                <header className="dash-panel-head">
                  <div>
                    <h2>Top products</h2>
                    <p>By units sold</p>
                  </div>
                </header>
                <TopProducts items={analytics.topProducts} />
              </section>

              <section className="admin-card dash-panel">
                <header className="dash-panel-head">
                  <div>
                    <h2>Low stock</h2>
                    <p>Fewer than 5 units left</p>
                  </div>
                </header>
                {analytics.lowStockList.length ? (
                  <ul className="dash-list">
                    {analytics.lowStockList.map((p) => (
                      <li key={p.id}>
                        <span className="dash-list-main">
                          <strong>{p.name}</strong>
                          <small>{p.sku}</small>
                        </span>
                        <span className={`stock-pill${Number(p.stock) === 0 ? " is-out" : ""}`}>
                          {Number(p.stock) === 0 ? "Out of stock" : `${p.stock} left`}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="chart-empty">All products are well stocked</div>
                )}
              </section>

              <section className="admin-card dash-panel dash-panel--wide">
                <header className="dash-panel-head">
                  <div>
                    <h2>Recent orders</h2>
                    <p>Latest activity</p>
                  </div>
                  <button type="button" className="dash-link" onClick={() => setCurrentTab("orders")}>
                    View all
                  </button>
                </header>
                {analytics.recentOrders.length ? (
                  <div className="table-scroll">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.recentOrders.map((o) => (
                          <tr key={o.id}>
                            <td>{o.id}</td>
                            <td>{o.customer}</td>
                            <td>₹{Number(o.total || 0).toLocaleString("en-IN")}</td>
                            <td>
                              <span
                                className="status-dot-badge"
                                style={{
                                  "--s": STATUS_COLORS[(o.status || "").toLowerCase()] || "#64748b",
                                }}
                              >
                                {o.status}
                              </span>
                            </td>
                            <td>{o.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="chart-empty">No orders yet</div>
                )}
              </section>
            </div>

            {selectedStat && (
              <div className="admin-card">
                <h2>
                  {selectedStat === "orders"
                    ? "All Orders"
                    : selectedStat === "pending"
                    ? "Pending Orders"
                    : "Low Stock Products"}
                </h2>
                {selectedStat === "lowstock" ? (
                  <div className="table-scroll">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>SKU</th>
                          <th>Name</th>
                          <th>Stock</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getFilteredData().map((p) => (
                          <tr key={p.id}>
                            <td>{p.sku}</td>
                            <td>{p.name}</td>
                            <td>{p.stock}</td>
                            <td>₹{p.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="table-scroll">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getFilteredData().map((o) => (
                          <tr key={o.id}>
                            <td>{o.id}</td>
                            <td>{o.customer}</td>
                            <td>₹{o.total}</td>
                            <td>
                              <span className={`status-badge ${statusColors[o.status]}`}>
                                {o.status}
                              </span>
                            </td>
                            <td>{o.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {currentTab === "orders" && (
          <div className="admin-content">
            <div className="admin-card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                  gap: "15px",
                  flexWrap: "wrap",
                }}
              >
                <h2 style={{ margin: 0 }}>All Orders</h2>

                <div style={{ flex: "1 1 260px", maxWidth: 320 }}>
                  <input
                    type="text"
                    placeholder="🔍 Search by order ID, customer, item..."
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: "1.5px solid #ddd",
                      fontSize: 14,
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              {orderSearchQuery.trim() && (
                <p style={{ fontSize: 13, color: "#666", marginTop: -10, marginBottom: 15 }}>
                  {filteredOrders.length} result{filteredOrders.length !== 1 ? "s" : ""} for
                  &quot;{orderSearchQuery}&quot;
                </p>
              )}

              {loading ? (
                <p>Loading...</p>
              ) : orders.length === 0 ? (
                <p>No orders yet</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: "center", padding: 20, color: "#888" }}>
                          No orders match your search
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((o) => (
                        <tr key={o.id}>
                          <td>{o.id}</td>
                          <td>{o.customer}</td>
                          <td>{o.items}</td>
                          <td>₹{o.total}</td>
                          <td>
                            <span className={`status-badge ${statusColors[o.status]}`}>
                              {o.status}
                            </span>
                          </td>
                          <td>{o.date}</td>
                          <td>
                            <div className="order-actions">
                              <button onClick={() => setSelectedOrder(o)}>👁 View</button>
                              <button
                                className="order-action order-action--pdf"
                                onClick={() => handleDownloadOrderPdf(o)}
                                title={`Download PDF for ${o.id}`}
                              >
                                ⬇ PDF
                              </button>
                              <button
                                className="order-action order-action--delete"
                                onClick={() => setOrderToDelete(o)}
                                title={`Delete ${o.id}`}
                              >
                                🗑 Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {orderToDelete && (
              <div className="modal-overlay" onClick={() => !deleting && setOrderToDelete(null)}>
                <div
                  className="modal-content confirm-modal"
                  onClick={(e) => e.stopPropagation()}
                  role="alertdialog"
                  aria-modal="true"
                  aria-labelledby="confirm-delete-title"
                >
                  <div className="modal-header">
                    <h2 id="confirm-delete-title">Delete this order?</h2>
                  </div>
                  <div className="modal-body">
                    <p className="confirm-target">
                      <strong>{orderToDelete.id}</strong> — {orderToDelete.customer} — ₹{orderToDelete.total}
                    </p>
                    <p className="confirm-note">
                      This removes the order from the admin list and from the customer&apos;s order
                      history. A copy is archived server-side, but this cannot be undone from here.
                    </p>
                  </div>
                  <div className="confirm-actions">
                    <button
                      className="confirm-btn confirm-btn--cancel"
                      onClick={() => setOrderToDelete(null)}
                      disabled={deleting}
                    >
                      Cancel
                    </button>
                    <button
                      className="confirm-btn confirm-btn--danger"
                      onClick={handleDeleteOrder}
                      disabled={deleting}
                    >
                      {deleting ? "Deleting..." : "Delete order"}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {selectedOrder && (
              <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h2>Order Details</h2>
                    <button className="close-modal" onClick={() => setSelectedOrder(null)}>
                      ✕
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="detail-section">
                      <h3>👤 Customer Info</h3>
                      <p><strong>Name:</strong> {selectedOrder.customer}</p>
                      <p><strong>Email:</strong> {selectedOrder.email}</p>
                      <p><strong>Phone:</strong> {selectedOrder.phone}</p>
                    </div>
                    <div className="detail-section">
                      <h3>📍 Address</h3>
                      <p>{selectedOrder.address}</p>
                    </div>
                    <div className="detail-section">
                      <h3>📦 Items</h3>
                      <p>{selectedOrder.items}</p>
                      <p><strong>Total:</strong> ₹{selectedOrder.total}</p>
                    </div>
                    <div className="detail-section">
                      <h3>Update Status</h3>
                      <div className="status-buttons">
                        {["pending", "processing", "shipped", "delivered"].map((s) => (
                          <button
                            key={s}
                            className={`status-update-btn ${
                              selectedOrder.status === s ? "active" : ""
                            }`}
                            onClick={() => updateOrderStatus(selectedOrder.id, s)}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="print-btn">🖨 Print Invoice</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentTab === "products" && (
          <div className="admin-content">
            <div className="admin-card">
              <div
                className="card-header"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                  gap: "15px",
                  flexWrap: "wrap",
                }}
              >
                <h2>Products Management</h2>

                <div style={{ flex: "1 1 260px", maxWidth: 320 }}>
                  <input
                    type="text"
                    placeholder="🔍 Search by name or SKU..."
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: "1.5px solid #ddd",
                      fontSize: 14,
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div className="action-buttons" style={{ display: "flex", gap: "15px" }}>
                  <button
                    className="add-btn"
                    onClick={() => {
                      setShowForm(true);
                      setEditingProduct(null);
                      setFormData({ name: "", category: "", stock: "", price: "", sku: "", description: "" });
                      setProductImage(null);
                      setImagePreview(null);
                    }}
                  >
                    ➕ Add Product
                  </button>
                  <button className="import-btn" onClick={handleExportExcel}>
                    📤 Import Excel
                  </button>
                </div>
              </div>

              {productSearchQuery.trim() && (
                <p style={{ fontSize: 13, color: "#666", marginTop: -10, marginBottom: 15 }}>
                  {filteredProducts.length} result{filteredProducts.length !== 1 ? "s" : ""} for
                  &quot;{productSearchQuery}&quot;
                </p>
              )}

              <div className="admin-table">
                <table>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>SKU</th>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>Stock</th>
                      <th>Price</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: "center", padding: 20, color: "#888" }}>
                          No products match your search
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p) => (
                        <tr key={p.id}>
                          <td>
                            {p.image ? (
                              <img
                                src={p.image}
                                alt={p.name}
                                style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 5 }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: 50,
                                  height: 50,
                                  background: "#f0f0f0",
                                  borderRadius: 5,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 20,
                                }}
                              >
                                🧴
                              </div>
                            )}
                          </td>
                          <td className="product-sku">{p.sku}</td>
                          <td><strong>{p.name}</strong></td>
                          <td>
                            <span className="category-badge">{p.category}</span>
                          </td>
                          <td>
                            <span className={p.stock < 5 ? "stock-low" : "stock-good"}>
                              {p.stock}
                            </span>
                          </td>
                          <td><strong>₹{p.price}</strong></td>
                          <td>
                            <button
                              className="edit-btn"
                              onClick={() => {
                                setEditingProduct(p);
                                setFormData({
                                  name: p.name,
                                  category: p.category,
                                  stock: p.stock,
                                  price: p.price,
                                  sku: p.sku,
                                  description: p.description || "",
                                });
                                setImagePreview(p.image);
                                setShowForm(true);
                              }}
                            >
                              ✏️
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => handleDeleteProduct(p.id)}
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {showForm && (
              <div className="modal-overlay" onClick={() => setShowForm(false)}>
                <div className="modal-content wide" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h2>{editingProduct ? "Edit Product" : "Add Product"}</h2>
                    <button className="close-modal" onClick={() => setShowForm(false)}>
                      ✕
                    </button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={handleSaveProduct}>
                      <input
                        type="text"
                        placeholder="Product Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />

                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                        style={{
                          padding: "12px",
                          width: "100%",
                          fontSize: "14px",
                          marginBottom: "15px",
                          borderRadius: "10px",
                          border: "1.5px solid #ddd",
                        }}
                      >
                        <option value="">Select Category</option>
                        <option value="Non-Consumable">Non-Consumable</option>
                        <option value="Consumable">Consumable</option>
                      </select>

                      <input
                        type="text"
                        placeholder="SKU"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        required
                      />

                      <input
                        type="number"
                        placeholder="Stock"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        required
                      />

                      <input
                        type="number"
                        placeholder="Price"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                      />

                      <textarea
                        placeholder="Product Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows="4"
                        style={{
                          width: "100%",
                          marginBottom: 15,
                          padding: 12,
                          borderRadius: 10,
                          border: "1.5px solid #ddd",
                          fontSize: 14,
                          fontFamily: "inherit",
                          resize: "vertical",
                        }}
                      />

                      <div style={{ marginBottom: 15 }}>
                        <label
                          htmlFor="product-image"
                          style={{
                            display: "block",
                            marginBottom: 8,
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#00333d",
                          }}
                        >
                          Product Image
                        </label>
                        <input
                          id="product-image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          style={{
                            width: "100%",
                            padding: 10,
                            border: "1.5px solid #ddd",
                            borderRadius: 10,
                            fontSize: 14,
                          }}
                        />
                        {imagePreview && (
                          <div style={{ marginTop: 15, textAlign: "center" }}>
                            <img
                              src={imagePreview}
                              alt="Preview"
                              style={{
                                maxWidth: "100%",
                                maxHeight: 200,
                                borderRadius: 10,
                                border: "2px solid #f0f0f0",
                              }}
                            />
                          </div>
                        )}
                      </div>

                      <button type="submit">
                        {editingProduct ? "Update Product" : "Add Product"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentTab === "customers" && (
          <div className="admin-content">
            <div className="admin-card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                  gap: "15px",
                  flexWrap: "wrap",
                }}
              >
                <h2 style={{ margin: 0 }}>Customers & Past Orders</h2>

                <div style={{ flex: "1 1 260px", maxWidth: 320 }}>
                  <input
                    type="text"
                    placeholder="🔍 Search by name or email..."
                    value={customerSearchQuery}
                    onChange={(e) => setCustomerSearchQuery(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: "1.5px solid #ddd",
                      fontSize: 14,
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <button className="import-btn" onClick={handleExportCustomersExcel}>
                  📤 Download Excel
                </button>
              </div>

              {customerSearchQuery.trim() && (
                <p style={{ fontSize: 13, color: "#666", marginTop: -10, marginBottom: 15 }}>
                  {filteredCustomers.length} result{filteredCustomers.length !== 1 ? "s" : ""} for
                  &quot;{customerSearchQuery}&quot;
                </p>
              )}

              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Total Orders</th>
                    <th>Total Spent</th>
                    <th>Last Order Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", padding: 20, color: "#888" }}>
                        No customers match your search
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((c) => (
                      <tr key={c.email}>
                        <td>{c.name}</td>
                        <td>{c.email}</td>
                        <td>{c.totalOrders}</td>
                        <td>₹{c.totalSpent}</td>
                        <td>{c.lastDate}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ✅ NEW: Companies tab — super admin only */}
        {currentTab === "companies" && isSuperAdmin && (
          <div className="admin-content">
            <div className="admin-card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                  gap: "15px",
                  flexWrap: "wrap",
                }}
              >
                <h2 style={{ margin: 0 }}>Companies</h2>

                <div style={{ flex: "1 1 260px", maxWidth: 320 }}>
                  <input
                    type="text"
                    placeholder="🔍 Search by company or email..."
                    value={companySearchQuery}
                    onChange={(e) => setCompanySearchQuery(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: "1.5px solid #ddd",
                      fontSize: 14,
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <button className="add-btn" onClick={() => setShowCompanyForm(true)}>
                  ➕ Add Company
                </button>
              </div>

              {companySearchQuery.trim() && (
                <p style={{ fontSize: 13, color: "#666", marginTop: -10, marginBottom: 15 }}>
                  {filteredCompanies.length} result{filteredCompanies.length !== 1 ? "s" : ""} for
                  &quot;{companySearchQuery}&quot;
                </p>
              )}

              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Company Name</th>
                    <th>Company ID</th>
                    <th>Admin Name</th>
                    <th>Admin Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCompanies.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: 20, color: "#888" }}>
                        No companies found
                      </td>
                    </tr>
                  ) : (
                    filteredCompanies.map((c) => (
                      <tr key={c.id}>
                        <td><strong>{c.companyName}</strong></td>
                        <td>{c.companyId}</td>
                        <td>{c.fullName}</td>
                        <td>{c.email}</td>
                        <td>{c.phone}</td>
                        <td>
                          {c.isSuperAdmin ? (
                            <span className="category-badge">Super Admin</span>
                          ) : (
                            <span className="category-badge">Company Admin</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {showCompanyForm && (
              <div className="modal-overlay" onClick={() => setShowCompanyForm(false)}>
                <div className="modal-content wide" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h2>Add Company</h2>
                    <button className="close-modal" onClick={() => setShowCompanyForm(false)}>
                      ✕
                    </button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={handleCreateCompany}>
                      <input
                        type="text"
                        placeholder="Company Name (e.g. ABC Medical)"
                        value={companyFormData.companyName}
                        onChange={(e) =>
                          setCompanyFormData({ ...companyFormData, companyName: e.target.value })
                        }
                        required
                      />

                      <input
                        type="text"
                        placeholder="Company ID (e.g. abc-medical — no spaces)"
                        value={companyFormData.companyId}
                        onChange={(e) =>
                          setCompanyFormData({
                            ...companyFormData,
                            companyId: e.target.value.trim().toLowerCase().replace(/\s+/g, "-"),
                          })
                        }
                        required
                      />

                      <input
                        type="text"
                        placeholder="Admin Full Name"
                        value={companyFormData.fullName}
                        onChange={(e) =>
                          setCompanyFormData({ ...companyFormData, fullName: e.target.value })
                        }
                        required
                      />

                      <input
                        type="email"
                        placeholder="Admin Email"
                        value={companyFormData.email}
                        onChange={(e) =>
                          setCompanyFormData({ ...companyFormData, email: e.target.value })
                        }
                        required
                      />

                      <input
                        type="text"
                        placeholder="Admin Phone"
                        value={companyFormData.phone}
                        onChange={(e) =>
                          setCompanyFormData({ ...companyFormData, phone: e.target.value })
                        }
                        required
                      />

                      <input
                        type="password"
                        placeholder="Admin Password"
                        value={companyFormData.password}
                        onChange={(e) =>
                          setCompanyFormData({ ...companyFormData, password: e.target.value })
                        }
                        required
                      />

                      <button type="submit">Create Company Admin</button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentTab === "settings" && (
          <div className="admin-content">
            <div className="admin-card">
              <h2>⚙️ Settings</h2>
              <p>Here you can manage profile, notifications, and system preferences.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}