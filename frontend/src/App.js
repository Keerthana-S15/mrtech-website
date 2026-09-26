// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { CartProvider } from "./context/CartContext";

// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";

// // Main pages
// import Home from "./pages/Home";
// import AboutUs from "./pages/AboutUs";
// import Solutions from "./pages/Solutions";
// import Partners from "./pages/Partners";
// import Contact from "./pages/Contact";
// import Story from "./pages/Story";
// import CrowdShakiPlatform from "./pages/CrowdShakiPlatform";
// import ServAttendance from "./pages/ServAttendance";
// import Team from "./pages/Team";
// import Gallery from "./pages/Gallery";
// import GalleryDetail from "./pages/GalleryDetail";
// import Purchase from "./pages/Purchase";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup.jsx";
// import Checkout from "./pages/Checkout";
// import OrderConfirmation from "./pages/OrderConfirmation";
// import OrderTracking from "./pages/OrderTracking";
// import GCareHealthATM from './pages/GCareHealthATM';
// import HealthScoreApp from './pages/HealthScoreApp';
// import AIAgricultureSolutions from './pages/AIAgricultureSolutions';
// import CHATrainingProgram from './pages/CHATrainingProgram';

// // Dashboards
// import AdminDashboard from "./pages/AdminDashboard";
// import CustomerDashboard from "./pages/CustomerDashboard";

// // Legal Pages
// import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
// import TermsConditions from "./pages/legal/TermsConditions";
// import RefundPolicy from "./pages/legal/RefundPolicy";
// import CancellationPolicy from "./pages/legal/CancellationPolicy";

// export default function App() {
//   return (
//     <CartProvider>
//       <Router>
//         <Routes>
//           {/* Dashboard routes WITHOUT navbar/footer */}
//           <Route path="/admin/dashboard" element={<AdminDashboard />} />
//           <Route path="/customer/dashboard" element={<CustomerDashboard />} />

//           {/* All other routes WITH navbar/footer */}
//           <Route
//             path="*"
//             element={
//               <>
//                 <Navbar />
//                 <main style={{ minHeight: "60vh" }}>
//                   <Routes>
//                     <Route path="/" element={<Home />} />
//                     <Route path="/about" element={<AboutUs />} />
//                     <Route path="/solutions" element={<Solutions />} />
//                     <Route path="/partners" element={<Partners />} />
//                     <Route path="/contact" element={<Contact />} />
//                     <Route path="/our-story" element={<Story />} />
//                     <Route path="/crowdshaki" element={<CrowdShakiPlatform />} />
//                     <Route path="/solutions/serv-attendance" element={<ServAttendance />} />
//                     <Route path="/gallery" element={<Gallery />} />
//                     <Route path="/gallery/:id" element={<GalleryDetail />} />
//                     <Route path="/team" element={<Team />} />
//                     <Route path="/team/:category" element={<Team />} />
//                     <Route path="/purchase" element={<Purchase />} />
//                     <Route path="/login" element={<Login />} />
//                     <Route path="/signup" element={<Signup />} />
//                     <Route path="/checkout" element={<Checkout />} />
//                     <Route path="/order-confirmation" element={<OrderConfirmation />} />
//                     <Route path="/track-order" element={<OrderTracking />} />
                    
//                     {/* Legal Pages */}
//                     <Route path="/privacy-policy" element={<PrivacyPolicy />} />
//                     <Route path="/terms-conditions" element={<TermsConditions />} />
//                     <Route path="/refund-policy" element={<RefundPolicy />} />
//                     <Route path="/cancellation-policy" element={<CancellationPolicy />} />
//                     <Route path="/solutions/gcare" element={<GCareHealthATM />} />
// <Route path="/solutions/health-score" element={<HealthScoreApp />} />
// <Route path="/solutions/agri" element={<AIAgricultureSolutions />} />
// <Route path="/solutions/cha" element={<CHATrainingProgram />} />
                    
//                     <Route path="*" element={<Navigate to="/" replace />} />
//                   </Routes>
//                 </main>
//                 <Footer />
//               </>
//             }
//           />
//         </Routes>
//       </Router>
//     </CartProvider>
//   );
// }






// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { CartProvider } from "./context/CartContext";

// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";

// // Main pages
// import Home from "./pages/Home";
// import AboutUs from "./pages/AboutUs";
// import Solutions from "./pages/Solutions";
// import Partners from "./pages/Partners";
// import Contact from "./pages/Contact";
// import Story from "./pages/Story";
// import CrowdShakiPlatform from "./pages/CrowdShakiPlatform";
// import ServAttendance from "./pages/ServAttendance";
// import Team from "./pages/Team";
// import Gallery from "./pages/Gallery";
// import GalleryDetail from "./pages/GalleryDetail";
// import Purchase from "./pages/Purchase";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup.jsx";
// import Checkout from "./pages/Checkout";
// import OrderConfirmation from "./pages/OrderConfirmation";
// import OrderTracking from "./pages/OrderTracking";
// import GCareHealthATM from './pages/GCareHealthATM';
// import HealthScoreApp from './pages/HealthScoreApp.jsx';
// import AIAgricultureSolutions from './pages/AIAgricultureSolutions';
// import CHATrainingProgram from './pages/CHATrainingProgram';

// // Dashboards
// import AdminDashboard from "./pages/AdminDashboard";
// import CustomerDashboard from "./pages/CustomerDashboard";

// // ✅ NEW: Route protection for admin-only pages
// import ProtectedRoute from "./pages/ProtectedRoute";

// // Legal Pages
// import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
// import TermsConditions from "./pages/legal/TermsConditions";
// import RefundPolicy from "./pages/legal/RefundPolicy";
// import CancellationPolicy from "./pages/legal/CancellationPolicy";

// export default function App() {
//   return (
//     <CartProvider>
//       <Router>
//         <Routes>
//           {/* Dashboard routes WITHOUT navbar/footer */}
//           {/* ✅ UPDATED: Admin dashboard is now protected — only logged-in admins can access it */}
//           <Route
//             path="/admin/dashboard"
//             element={
//               <ProtectedRoute>
//                 <AdminDashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route path="/customer/dashboard" element={<CustomerDashboard />} />

//           {/* All other routes WITH navbar/footer */}
//           <Route
//             path="*"
//             element={
//               <>
//                 <Navbar />
//                 <main style={{ minHeight: "60vh" }}>
//                   <Routes>
//                     <Route path="/" element={<Home />} />
//                     <Route path="/about" element={<AboutUs />} />
//                     <Route path="/solutions" element={<Solutions />} />
//                     <Route path="/partners" element={<Partners />} />
//                     <Route path="/contact" element={<Contact />} />
//                     <Route path="/our-story" element={<Story />} />
//                     <Route path="/crowdshaki" element={<CrowdShakiPlatform />} />
//                     <Route path="/solutions/serv-attendance" element={<ServAttendance />} />
//                     <Route path="/gallery" element={<Gallery />} />
//                     <Route path="/gallery/:id" element={<GalleryDetail />} />
//                     <Route path="/team" element={<Team />} />
//                     <Route path="/team/:category" element={<Team />} />
//                     <Route path="/purchase" element={<Purchase />} />
//                     <Route path="/login" element={<Login />} />
//                     <Route path="/signup" element={<Signup />} />
//                     <Route path="/checkout" element={<Checkout />} />
//                     <Route path="/order-confirmation" element={<OrderConfirmation />} />
//                     <Route path="/track-order" element={<OrderTracking />} />
                    
//                     {/* Legal Pages */}
//                     <Route path="/privacy-policy" element={<PrivacyPolicy />} />
//                     <Route path="/terms-conditions" element={<TermsConditions />} />
//                     <Route path="/refund-policy" element={<RefundPolicy />} />
//                     <Route path="/cancellation-policy" element={<CancellationPolicy />} />
//                     <Route path="/solutions/gcare" element={<GCareHealthATM />} />
//                     <Route path="/solutions/health-score" element={<HealthScoreApp />} />
//                     <Route path="/solutions/agri" element={<AIAgricultureSolutions />} />
//                     <Route path="/solutions/cha" element={<CHATrainingProgram />} />
                    
//                     <Route path="*" element={<Navigate to="/" replace />} />
//                   </Routes>
//                 </main>
//                 <Footer />
//               </>
//             }
//           />
//         </Routes>
//       </Router>
//     </CartProvider>
//   );
// }



import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Main pages
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import ForgotPassword from "./pages/ForgotPassword";
import Solutions from "./pages/Solutions";
import Partners from "./pages/Partners";
import Contact from "./pages/Contact";
import Story from "./pages/Story";
import NandagoPage from "./pages/Nandagopage";
import ServAttendance from "./pages/ServAttendance";
import Team from "./pages/Team";
import Gallery from "./pages/Gallery";
import GalleryDetail from "./pages/GalleryDetail";
import Purchase from "./pages/Purchase";
import Login from "./pages/Login";
import Signup from "./pages/Signup.jsx";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderTracking from "./pages/OrderTracking";
import GCareHealthATM from './pages/GCareHealthATM';
import HealthScoreApp from './pages/HealthScoreApp.jsx';
import AIAgricultureSolutions from './pages/AIAgricultureSolutions';
import CHATrainingProgram from './pages/CHATrainingProgram';

// Dashboards
import AdminDashboard from "./pages/AdminDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";

// ✅ NEW: Route protection for admin-only pages
import ProtectedRoute from "./pages/ProtectedRoute";

// Legal Pages
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsConditions from "./pages/legal/TermsConditions";
import RefundPolicy from "./pages/legal/RefundPolicy";
import CancellationPolicy from "./pages/legal/CancellationPolicy";

export default function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Dashboard routes WITHOUT navbar/footer */}
          {/* ✅ UPDATED: Admin dashboard is now protected — only logged-in admins can access it */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />

          {/* All other routes WITH navbar/footer */}
          <Route
            path="*"
            element={
              <>
                <Navbar />
                <main style={{ minHeight: "60vh" }}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/solutions" element={<Solutions />} />
                    <Route path="/partners" element={<Partners />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/our-story" element={<Story />} />
                    <Route path="/crowdshaki" element={<NandagoPage />} />
                    <Route path="/solutions/serv-attendance" element={<ServAttendance />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/gallery/:id" element={<GalleryDetail />} />
                    <Route path="/team" element={<Team />} />
                    <Route path="/team/:category" element={<Team />} />
                    <Route path="/purchase" element={<Purchase />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-confirmation" element={<OrderConfirmation />} />
                    <Route path="/track-order" element={<OrderTracking />} />
                    
                    {/* Legal Pages */}
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-conditions" element={<TermsConditions />} />
                    <Route path="/refund-policy" element={<RefundPolicy />} />
                    <Route path="/cancellation-policy" element={<CancellationPolicy />} />
                    <Route path="/solutions/gcare" element={<GCareHealthATM />} />
                    <Route path="/solutions/health-score" element={<HealthScoreApp />} />
                    <Route path="/solutions/agri" element={<AIAgricultureSolutions />} />
                    <Route path="/solutions/cha" element={<CHATrainingProgram />} />
                    
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
                <Footer />
              </>
            }
          />
        </Routes>
      </Router>
    </CartProvider>
  );
}