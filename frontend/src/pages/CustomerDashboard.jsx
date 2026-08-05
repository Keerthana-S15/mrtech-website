import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CustomerDashboard.css";
import { 
  FaBox, FaTruck, FaWallet, FaShoppingBag, FaMapMarkerAlt, 
  FaHeadset, FaHeart, FaHistory, FaUser, FaBell, FaSearch,
  FaChartLine, FaStar, FaGift, FaClock, FaExclamationCircle,
  FaCheckCircle, FaTimesCircle, FaSpinner
} from "react-icons/fa";

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    activeOrders: 0,
    deliveredOrders: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const API_BASE_URL = "http://localhost:3000/api";

  // ✅ Get user data from localStorage
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userData"));
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!data || data.userType !== "customer" || !isLoggedIn) {
      navigate("/login");
    } else {
      setUserData(data);
    }
  }, [navigate]);

  // ✅ Fetch all data when user is available
  useEffect(() => {
    if (userData && userData.email) {
      fetchAllData();
    }
  }, [userData]);

  // 🔥 Fetch all customer data (orders, stats, notifications)
  const fetchAllData = async () => {
    setError(null);
    await Promise.all([
      fetchOrders(),
      fetchStats(),
      fetchRecentOrdersForNotifications()
    ]);
  };

  // 📦 Fetch user's orders with better error handling
  const fetchOrders = async () => {
    if (!userData?.email) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/orders/customer/${userData.email}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.orders || []);
        console.log(`✅ Loaded ${data.orders?.length || 0} orders`);
      } else {
        setError(data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
      setError("Unable to connect to server. Please check if the backend is running.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // 📊 Fetch customer statistics with improved calculation
  const fetchStats = async () => {
    if (!userData?.email) return;
    
    setStatsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/orders/customer/${userData.email}/stats`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
        console.log("✅ Stats loaded:", data.stats);
      } else {
        console.error("Failed to fetch stats:", data.message);
      }
    } catch (error) {
      console.error("❌ Error fetching stats:", error);
      // Set default stats on error
      setStats({
        totalOrders: 0,
        totalSpent: 0,
        activeOrders: 0,
        deliveredOrders: 0,
        pendingOrders: 0
      });
    } finally {
      setStatsLoading(false);
    }
  };

  // 🔔 Fetch recent orders for notifications
  const fetchRecentOrdersForNotifications = async () => {
    if (!userData?.email) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/orders/customer/${userData.email}/recent?limit=5`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.orders) {
        // Convert recent orders to notification format
        const orderNotifications = data.orders.map((order, index) => ({
          id: order.orderId,
          message: `Order #${order.orderId} is ${order.orderStatus}`,
          time: getTimeAgo(order.createdAt),
          unread: index < 2, // Mark first 2 as unread
          orderStatus: order.orderStatus,
          type: getNotificationType(order.orderStatus)
        }));
        
        setNotifications(orderNotifications);
        console.log(`✅ Loaded ${orderNotifications.length} notifications`);
      }
    } catch (error) {
      console.error("❌ Error fetching notifications:", error);
      // Fallback to welcome notification
      setNotifications([
        { 
          id: 1, 
          message: "Welcome to your dashboard! Start shopping to see your orders.", 
          time: "Just now", 
          unread: true,
          type: "info"
        }
      ]);
    }
  };

  // 🎨 Get notification type based on order status
  const getNotificationType = (status) => {
    switch (status) {
      case "delivered": return "success";
      case "cancelled": return "error";
      case "pending": return "warning";
      default: return "info";
    }
  };

  // 🕒 Helper function to get time ago
  const getTimeAgo = (dateString) => {
    if (!dateString) return "Unknown";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate("/login");
    }
  };

  const handleRefresh = async () => {
    setSuccessMessage(null);
    await fetchAllData();
    setSuccessMessage("Dashboard refreshed successfully!");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // 🎯 Handle Track Order with proper navigation
  const handleTrackOrder = (orderId) => {
    console.log("Tracking order:", orderId);
    navigate("/track-order", { state: { orderId: orderId } });
  };

  // 📋 Handle View Order Details
  const handleViewDetails = (order) => {
    console.log("Viewing order details:", order);
    // You can navigate to a dedicated order details page or show a modal
    navigate("/order-details", { state: { order: order } });
  };

  if (!userData) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  // Filter orders based on search and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.items?.some(item => item.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         order.customerName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || order.orderStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const statusColors = {
    pending: "status-pending",
    processing: "status-processing",
    confirmed: "status-confirmed",
    shipped: "status-shipped",
    delivered: "status-delivered",
    cancelled: "status-cancelled"
  };

  const statusIcons = {
    pending: <FaClock />,
    processing: <FaSpinner className="spinning" />,
    confirmed: <FaCheckCircle />,
    shipped: <FaTruck />,
    delivered: <FaCheckCircle />,
    cancelled: <FaTimesCircle />
  };

  const unreadNotifications = notifications.filter(n => n.unread).length;

  return (
    <div className="customer-dashboard-new">
      {/* Top Navigation Bar */}
      <nav className="dashboard-navbar">
        <div className="navbar-left">
          <div className="brand">
            <FaBox className="brand-icon" />
            <span>My Dashboard</span>
          </div>
        </div>
        
        <div className="navbar-center">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search orders, products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="navbar-right">
          <button 
            className="notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
          >
            <FaBell />
            {unreadNotifications > 0 && (
              <span className="notification-badge">{unreadNotifications}</span>
            )}
          </button>

          <div className="user-menu">
            <div className="user-avatar">
              <FaUser />
            </div>
            <div className="user-info">
              <span className="user-name">{userData.fullName}</span>
              <span className="user-role">Customer</span>
            </div>
          </div>

          <button className="logout-btn-new" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <h3>Notifications</h3>
            <button onClick={() => setShowNotifications(false)}>✕</button>
          </div>
          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="notification-item">
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`notification-item ${notif.unread ? 'unread' : ''} notification-${notif.type}`}
                >
                  <div className="notification-icon">
                    {notif.type === "success" && <FaCheckCircle />}
                    {notif.type === "error" && <FaTimesCircle />}
                    {notif.type === "warning" && <FaExclamationCircle />}
                    {notif.type === "info" && <FaBell />}
                  </div>
                  <div className="notification-content">
                    <p>{notif.message}</p>
                    <span className="notification-time">{notif.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div className="dashboard-container">
        {/* Success Message */}
        {successMessage && (
          <div className="success-alert">
            <FaCheckCircle />
            <span>{successMessage}</span>
            <button onClick={() => setSuccessMessage(null)}>✕</button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="error-alert">
            <FaExclamationCircle />
            <span>{error}</span>
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        {/* Hero Welcome Section */}
        <section className="welcome-section">
          <div className="welcome-content">
            <h1>Welcome back, {userData.fullName.split(' ')[0]}! 👋</h1>
            <p>Here's what's happening with your orders today</p>
          </div>
          <div className="welcome-actions">
            <button className="primary-action-btn" onClick={() => navigate("/purchase")}>
              <FaShoppingBag /> Continue Shopping
            </button>
          </div>
        </section>

        {/* Statistics Cards */}
        <section className="stats-section">
          <div className="stat-card-new blue-card">
            <div className="stat-icon-wrapper blue">
              <FaBox />
            </div>
            <div className="stat-content">
              <h3>Total Orders</h3>
              <p className="stat-number">
                {statsLoading ? <FaSpinner className="spinning" /> : stats.totalOrders}
              </p>
              <span className="stat-label">All time orders</span>
            </div>
            <div className="stat-chart">
              <FaChartLine />
            </div>
          </div>

          <div className="stat-card-new orange-card">
            <div className="stat-icon-wrapper orange">
              <FaTruck />
            </div>
            <div className="stat-content">
              <h3>Active Orders</h3>
              <p className="stat-number">
                {statsLoading ? <FaSpinner className="spinning" /> : stats.activeOrders}
              </p>
              <span className="stat-label">Processing & Shipped</span>
            </div>
            <div className="stat-chart">
              <FaClock />
            </div>
          </div>

          <div className="stat-card-new green-card">
            <div className="stat-icon-wrapper green">
              <FaWallet />
            </div>
            <div className="stat-content">
              <h3>Total Spent</h3>
              <p className="stat-number">
                {statsLoading ? <FaSpinner className="spinning" /> : `₹${stats.totalSpent.toLocaleString('en-IN')}`}
              </p>
              <span className="stat-label">Lifetime spending</span>
            </div>
            <div className="stat-chart">
              <FaStar />
            </div>
          </div>

          <div className="stat-card-new purple-card">
            <div className="stat-icon-wrapper purple">
              <FaGift />
            </div>
            <div className="stat-content">
              <h3>Delivered</h3>
              <p className="stat-number">
                {statsLoading ? <FaSpinner className="spinning" /> : stats.deliveredOrders}
              </p>
              <span className="stat-label">Successfully delivered</span>
            </div>
            <div className="stat-chart">
              <FaHistory />
            </div>
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section className="quick-actions-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="quick-actions-grid">
            <div className="action-card" onClick={() => navigate("/purchase")}>
              <div className="action-icon blue-bg">
                <FaShoppingBag />
              </div>
              <h3>Browse Products</h3>
              <p>Explore our latest collection</p>
            </div>

            <div className="action-card" onClick={() => navigate("/track-order")}>
              <div className="action-icon orange-bg">
                <FaMapMarkerAlt />
              </div>
              <h3>Track Order</h3>
              <p>Get real-time updates</p>
            </div>

            <div className="action-card" onClick={() => navigate("/contact")}>
              <div className="action-icon green-bg">
                <FaHeadset />
              </div>
              <h3>Support</h3>
              <p>We're here to help</p>
            </div>

            <div className="action-card" onClick={() => setFilterStatus("delivered")}>
              <div className="action-icon purple-bg">
                <FaHistory />
              </div>
              <h3>Order History</h3>
              <p>View past purchases</p>
            </div>
          </div>
        </section>

        {/* Orders Section */}
        <section className="orders-section-new">
          <div className="orders-header">
            <div>
              <h2 className="section-title">Your Orders</h2>
              <p className="section-subtitle">
                {filteredOrders.length === 0 && !loading 
                  ? "No orders to display"
                  : `Showing ${filteredOrders.length} of ${orders.length} orders`
                }
              </p>
            </div>
            <div className="orders-controls">
              <select 
                className="filter-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Orders ({orders.length})</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button 
                className="refresh-btn-new" 
                onClick={handleRefresh}
                disabled={loading}
              >
                🔄 {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-state-new">
              <div className="loading-spinner"></div>
              <p>Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="empty-state-new">
              <div className="empty-illustration">
                <FaBox size={80} />
              </div>
              <h3>No orders found</h3>
              <p>
                {searchQuery || filterStatus !== "all" 
                  ? "Try adjusting your filters or search query"
                  : "Start shopping to see your orders here"
                }
              </p>
              {(searchQuery || filterStatus !== "all") && (
                <button 
                  className="clear-filters-btn" 
                  onClick={() => {
                    setSearchQuery("");
                    setFilterStatus("all");
                  }}
                >
                  Clear Filters
                </button>
              )}
              <button className="shop-now-btn-new" onClick={() => navigate("/purchase")}>
                <FaShoppingBag /> Start Shopping
              </button>
            </div>
          ) : (
            <div className="orders-grid">
              {filteredOrders.map((order) => (
                <div key={order.orderId} className="order-card-new">
                  <div className="order-card-header-new">
                    <div className="order-id-section">
                      <FaBox className="order-icon" />
                      <div>
                        <strong className="order-id-text">#{order.orderId}</strong>
                        <span className="order-date-text">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'Date unavailable'}
                        </span>
                      </div>
                    </div>
                    <span className={`status-badge-new ${statusColors[order.orderStatus] || 'status-pending'}`}>
                      {statusIcons[order.orderStatus] || <FaClock />}
                      {order.orderStatus}
                    </span>
                  </div>

                  <div className="order-card-body-new">
                    <div className="order-items-section">
                      <h4>Items Ordered ({order.items?.length || 0})</h4>
                      <div className="items-list">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="item-row">
                            <span className="item-name">{item.name || 'Unknown Item'}</span>
                            <span className="item-qty">x{item.quantity || 1}</span>
                          </div>
                        )) || <p>No items</p>}
                      </div>
                    </div>

                    <div className="order-details-grid">
                      <div className="detail-item">
                        <span className="detail-label">💳 Payment</span>
                        <strong>{order.paymentMethod || 'N/A'}</strong>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">💰 Total</span>
                        <strong className="amount-text">
                          ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
                        </strong>
                      </div>
                    </div>

                    {order.shippingAddress && (
                      <div className="order-address-new">
                        <FaMapMarkerAlt />
                        <p>
                          {order.shippingAddress.city || ''}, {order.shippingAddress.state || ''} 
                          {order.shippingAddress.pincode ? ` - ${order.shippingAddress.pincode}` : ''}
                        </p>
                      </div>
                    )}

                    {order.estimatedDelivery && (
                      <div className="delivery-estimate">
                        <FaClock />
                        <span>Estimated: {order.estimatedDelivery}</span>
                      </div>
                    )}
                  </div>

                  <div className="order-card-footer-new">
                    <button
                      className="track-btn-new"
                      onClick={() => handleTrackOrder(order.orderId)}
                    >
                      <FaMapMarkerAlt /> Track Order
                    </button>
                    <button 
                      className="details-btn-new"
                      onClick={() => handleViewDetails(order)}
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}