// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "./Navbar.css";

// const Navbar = () => {
//   const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userInitial, setUserInitial] = useState("");
//   const [showProfileDropdown, setShowProfileDropdown] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const navigate = useNavigate();

//   // Check login status and get user initial
//   useEffect(() => {
//     const checkLoginStatus = () => {
//       const loggedIn = localStorage.getItem("isLoggedIn");
//       const userData = JSON.parse(localStorage.getItem("userData"));
      
//       if (loggedIn === "true" && userData) {
//         setIsLoggedIn(true);
//         // Get first letter of user's full name
//         const firstLetter = userData.fullName?.charAt(0).toUpperCase() || "U";
//         setUserInitial(firstLetter);
//       } else {
//         setIsLoggedIn(false);
//         setUserInitial("");
//       }
//     };

//     checkLoginStatus();

//     // Listen for storage changes (when user logs in/out in another tab)
//     window.addEventListener("storage", checkLoginStatus);
    
//     return () => {
//       window.removeEventListener("storage", checkLoginStatus);
//     };
//   }, []);

//   // Close mobile menu when window is resized to desktop
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth > 768) {
//         setIsMobileMenuOpen(false);
//         document.body.classList.remove('mobile-menu-open');
//       }
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       // Check if click is outside the dropdown
//       const dropdownElement = event.target.closest('.dropdown');
//       const profileDropdownElement = event.target.closest('.profile-dropdown');
      
//       if (!dropdownElement) {
//         setIsTeamDropdownOpen(false);
//       }
      
//       if (!profileDropdownElement) {
//         setShowProfileDropdown(false);
//       }
//     };

//     // Add event listener when component mounts
//     document.addEventListener('click', handleClickOutside);
    
//     // Cleanup
//     return () => {
//       document.removeEventListener('click', handleClickOutside);
//     };
//   }, []);

//   const toggleTeamDropdown = () => {
//     setIsTeamDropdownOpen(!isTeamDropdownOpen);
//   };

//   const closeDropdown = () => {
//     setIsTeamDropdownOpen(false);
//   };

//   const toggleProfileDropdown = () => {
//     setShowProfileDropdown(!showProfileDropdown);
//   };

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//     // Prevent body scroll when menu is open
//     if (!isMobileMenuOpen) {
//       document.body.classList.add('mobile-menu-open');
//     } else {
//       document.body.classList.remove('mobile-menu-open');
//     }
//   };

//   const closeMobileMenu = () => {
//     setIsMobileMenuOpen(false);
//     setIsTeamDropdownOpen(false);
//     setShowProfileDropdown(false);
//     document.body.classList.remove('mobile-menu-open');
//   };

//   const handleLogout = () => {
//     if (window.confirm("Are you sure you want to logout?")) {
//       localStorage.clear();
//       setIsLoggedIn(false);
//       setUserInitial("");
//       setShowProfileDropdown(false);
//       closeMobileMenu();
//       navigate("/login");
//     }
//   };

//   const handleDashboardClick = () => {
//     const userData = JSON.parse(localStorage.getItem("userData"));
//     if (userData) {
//       if (userData.userType === "admin") {
//         navigate("/admin/dashboard");
//       } else if (userData.userType === "customer") {
//         navigate("/customer/dashboard");
//       }
//     }
//     closeMobileMenu();
//   };

//   return (
//     <nav className="navbar">
//       {/* Left: Logo */}
//       <div className="nav-logo">
//         <Link to="/" className="logo-link" onClick={closeMobileMenu}>
//           <img src="/MR LOGO.jpeg" alt="Company Logo" className="logo-img" />
//           <span className="logo-text">
//             Myth Reality Technologies Pvt. Ltd.
//           </span>
//         </Link>
//       </div>

//       {/* Mobile Menu Toggle Button */}
//       <button 
//         className="mobile-menu-toggle" 
//         onClick={toggleMobileMenu}
//         aria-label="Toggle mobile menu"
//       >
//         {isMobileMenuOpen ? "✕" : "☰"}
//       </button>

//       {/* Center: Links */}
//       <ul className={`nav-links ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
//         <li><Link to="/" onClick={closeMobileMenu}>Home</Link></li>
//         <li><Link to="/about" onClick={closeMobileMenu}>About Us</Link></li>

//         <li className="dropdown">
//           <span className="dropdown-title" onClick={toggleTeamDropdown}>
//             Team {isTeamDropdownOpen ? "▲" : "▼"}
//           </span>
//           {isTeamDropdownOpen && (
//             <ul className="dropdown-menu show">
//               <li>
//                 <Link to="/team/ai-scientists" onClick={() => { closeDropdown(); closeMobileMenu(); }}>
//                   AI Scientists 
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/team/healthcare" onClick={() => { closeDropdown(); closeMobileMenu(); }}>
//                   Healthcare Technologists 
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/team/data-engineers" onClick={() => { closeDropdown(); closeMobileMenu(); }}>
//                   Data Engineers 
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/team/social-entrepreneurs" onClick={() => { closeDropdown(); closeMobileMenu(); }}>
//                   Social Entrepreneurs 
//                 </Link>
//               </li>
//             </ul>
//           )}
//         </li>

//         <li><Link to="/solutions" onClick={closeMobileMenu}>Solutions</Link></li>
//         <li><Link to="/partners" onClick={closeMobileMenu}>Partners</Link></li>
//         <li><Link to="/gallery" onClick={closeMobileMenu}>Gallery</Link></li>
//         <li><Link to="/contact" onClick={closeMobileMenu}>Contact</Link></li>
//         <li><Link to="/purchase" onClick={closeMobileMenu}>Purchase</Link></li>
        
//         {/* Conditional Login/Profile */}
//         {isLoggedIn ? (
//           <li className="profile-dropdown">
//             <div className="profile-icon" onClick={toggleProfileDropdown}>
//               {userInitial}
//             </div>
//             {showProfileDropdown && (
//               <ul className="profile-dropdown-menu show">
//                 <li onClick={handleDashboardClick}>
//                   <span>📊 Dashboard</span>
//                 </li>
//                 <li onClick={handleLogout}>
//                   <span>🚪 Logout</span>
//                 </li>
//               </ul>
//             )}
//           </li>
//         ) : (
//           <li><Link to="/login" onClick={closeMobileMenu}>Login</Link></li>
//         )}
//       </ul>
//     </nav>
//   );
// };

// export default Navbar;




import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInitial, setUserInitial] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Check login status and get user initial
  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem("isLoggedIn");
      const userData = JSON.parse(localStorage.getItem("userData"));
      
      if (loggedIn === "true" && userData) {
        setIsLoggedIn(true);
        // Get first letter of user's full name
        const firstLetter = userData.fullName?.charAt(0).toUpperCase() || "U";
        setUserInitial(firstLetter);
      } else {
        setIsLoggedIn(false);
        setUserInitial("");
      }
    };

    checkLoginStatus();

    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener("storage", checkLoginStatus);
    
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  // Close mobile menu when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
        document.body.classList.remove('mobile-menu-open');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside the dropdown
      const dropdownElement = event.target.closest('.dropdown');
      const profileDropdownElement = event.target.closest('.profile-dropdown');
      
      if (!dropdownElement) {
        setIsTeamDropdownOpen(false);
      }
      
      if (!profileDropdownElement) {
        setShowProfileDropdown(false);
      }
    };

    // Add event listener when component mounts
    document.addEventListener('click', handleClickOutside);
    
    // Cleanup
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const toggleTeamDropdown = () => {
    setIsTeamDropdownOpen(!isTeamDropdownOpen);
  };

  const closeDropdown = () => {
    setIsTeamDropdownOpen(false);
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Prevent body scroll when menu is open
    if (!isMobileMenuOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsTeamDropdownOpen(false);
    setShowProfileDropdown(false);
    document.body.classList.remove('mobile-menu-open');
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      setIsLoggedIn(false);
      setUserInitial("");
      setShowProfileDropdown(false);
      closeMobileMenu();
      navigate("/login");
    }
  };

  const handleDashboardClick = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      if (userData.userType === "admin") {
        navigate("/admin/dashboard");
      } else if (userData.userType === "customer") {
        navigate("/customer/dashboard");
      }
    }
    closeMobileMenu();
  };

  // ✅ NEW: Guard the Purchase link — only logged-in users can go there.
  // If not logged in, send them to /login instead.
  const handlePurchaseClick = (e) => {
    e.preventDefault();
    closeMobileMenu();
    if (isLoggedIn) {
      navigate("/purchase");
    } else {
      alert("Please login to continue to Purchase.");
      navigate("/login");
    }
  };

  return (
    <nav className="navbar">
      {/* Left: Logo */}
      <div className="nav-logo">
        <Link to="/" className="logo-link" onClick={closeMobileMenu}>
          <img src="/MR LOGO.jpeg" alt="Company Logo" className="nav-logo-img" />
          <span className="logo-text">
            Myth Reality Technologies Pvt. Ltd.
          </span>
        </Link>
      </div>

      {/* Mobile Menu Toggle Button */}
      <button 
        className="mobile-menu-toggle" 
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
      >
        {isMobileMenuOpen ? "✕" : "☰"}
      </button>

      {/* Center: Links */}
      <ul className={`nav-links ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
        <li><Link to="/" onClick={closeMobileMenu}>Home</Link></li>
        <li><Link to="/about" onClick={closeMobileMenu}>About Us</Link></li>

        <li className="dropdown">
          <span className="dropdown-title" onClick={toggleTeamDropdown}>
            Team {isTeamDropdownOpen ? "▲" : "▼"}
          </span>
          {isTeamDropdownOpen && (
            <ul className="dropdown-menu show">
              <li>
                <Link to="/team/ai-scientists" onClick={() => { closeDropdown(); closeMobileMenu(); }}>
                  AI Scientists 
                </Link>
              </li>
              <li>
                <Link to="/team/healthcare" onClick={() => { closeDropdown(); closeMobileMenu(); }}>
                  Healthcare Technologists 
                </Link>
              </li>
              <li>
                <Link to="/team/data-engineers" onClick={() => { closeDropdown(); closeMobileMenu(); }}>
                  Data Engineers 
                </Link>
              </li>
              <li>
                <Link to="/team/social-entrepreneurs" onClick={() => { closeDropdown(); closeMobileMenu(); }}>
                  Social Entrepreneurs 
                </Link>
              </li>
            </ul>
          )}
        </li>

        <li><Link to="/solutions" onClick={closeMobileMenu}>Solutions</Link></li>
        <li><Link to="/partners" onClick={closeMobileMenu}>Partners</Link></li>
        <li><Link to="/gallery" onClick={closeMobileMenu}>Gallery</Link></li>
        <li><Link to="/contact" onClick={closeMobileMenu}>Contact</Link></li>

        {/* ✅ UPDATED: Purchase link now checks login status before navigating */}
        <li><a href="/purchase" onClick={handlePurchaseClick}>Purchase</a></li>
        
        {/* Conditional Login/Profile */}
        {isLoggedIn ? (
          <li className="profile-dropdown">
            <div className="profile-icon" onClick={toggleProfileDropdown}>
              {userInitial}
            </div>
            {showProfileDropdown && (
              <ul className="profile-dropdown-menu show">
                <li onClick={handleDashboardClick}>
                  <span>📊 Dashboard</span>
                </li>
                <li onClick={handleLogout}>
                  <span>🚪 Logout</span>
                </li>
              </ul>
            )}
          </li>
        ) : (
          <li><Link to="/login" onClick={closeMobileMenu}>Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;