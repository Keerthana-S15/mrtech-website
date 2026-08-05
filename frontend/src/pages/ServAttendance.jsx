// import React from 'react';
// import './ServAttendance.css';

// const ServAttendance = () => {
//   const adminFeatures = [
//     {
//       category: "🔐 Authentication & Security",
//       icon: "🔐",
//       features: [
//         { title: "Login Page (Employee/Admin)", desc: "Secure dual-role authentication with email/password, separate dashboards for employees and admins, password visibility toggle, and account recovery options." },
//         { title: "Forgot Password", desc: "Secure password recovery using OTP verification sent to registered email for creating new password." }
//       ]
//     },
//     {
//       category: "📊 Attendance Management",
//       icon: "📊",
//       features: [
//         { title: "Checked-in Employees", desc: "View all employees who have successfully checked in with their name and ID" },
//         { title: "Present Employees", desc: "Real-time list of currently present employees" },
//         { title: "Absent Employees", desc: "Track employees who haven't checked in" },
//         { title: "Waiting for Approvals", desc: "Manage pending attendance correction requests" },
//         { title: "Employee List", desc: "Comprehensive view with ID, date, check-in time, department, and shift details" },
//         { title: "Employee Attendance Detail", desc: "Detailed records including shift, location, GPS coordinates, and status" }
//       ]
//     },
//     {
//       category: "📍 Location & Geofencing",
//       icon: "📍",
//       features: [
//         { title: "Geolocation Tracking", desc: "Track employee check-in location using GPS coordinates (latitude and longitude)" },
//         { title: "Branch Location Verification", desc: "Display branch location on Google Maps for comparison" },
//         { title: "Location-Based Verification", desc: "Validate if employee is within allowed radius with exact distance calculation" }
//       ]
//     },
//     {
//       category: "📋 Leave & Request Management",
//       icon: "📋",
//       features: [
//         { title: "Leave Approvals", desc: "Manage late check-in, early check-out, and remote work requests with Approve/Reject options" },
//         { title: "Request Filters", desc: "Filter by All, Late Check-in, Early Check-out, Leave Type, Permission, Over Time, Half Day, Comp Off, and Other Location" },
//         { title: "Detailed Request View", desc: "See employee reason, rejection remarks, location on map, and distance from branch" },
//         { title: "Status Updates", desc: "Real-time approval workflow with Pending, Approved, and Rejected tabs" }
//       ]
//     },
//     {
//       category: "👥 Employee Management",
//       icon: "👥",
//       features: [
//         { title: "Dashboard Overview", desc: "View Total, Active, Inactive, Suspended, and Relieved employee counts" },
//         { title: "Create Employee", desc: "Onboard new employees with Name, ID, Email, Mobile, Shift, Department, Designation, and Status" },
//         { title: "Employee List", desc: "Searchable table with all employee details" },
//         { title: "Report Scheduler", desc: "Create automated performance and attendance reports" }
//       ]
//     },
//     {
//       category: "📈 Reports & Analytics",
//       icon: "📈",
//       features: [
//         { title: "Attendance Reports", desc: "Generate reports with date range filters showing Active, On Leave, Checked-In, Absent, Late, Field, Early Check-Out, and Half Day" },
//         { title: "Limit View", desc: "Category summary cards (Present, Absent, Leave, Holiday, Week Off, Half Day, Regularized) with detailed audit tables" },
//         { title: "Downloadable Reports", desc: "Export attendance data for record-keeping and analysis" }
//       ]
//     },
//     {
//       category: "🎯 Additional Admin Modules",
//       icon: "🎯",
//       features: [
//         { title: "My Tasks", desc: "Assign tasks to employees with title, description, and due dates. View daily progress updates" },
//         { title: "Rewards", desc: "Recognize employee achievements by recording name, ID, department, and description" },
//         { title: "Feedback", desc: "View all employee feedback with ID, name, message, and submission date" },
//         { title: "Event Updates", desc: "Create and manage organizational events with name, date range, and export capabilities" }
//       ]
//     },
//     {
//       category: "⚙️ Settings & Configuration",
//       icon: "⚙️",
//       features: [
//         { title: "Workdays & Shifts", desc: "Configure shift timings, create custom shifts with start/end times, and assign to groups" },
//         { title: "Leave & Holiday", desc: "Add leave types (Planned, Sick, Emergency) with date ranges and automatic day calculation" },
//         { title: "Company Profile", desc: "Store organization name, official email, phone, website, and admin details" },
//         { title: "Office Location", desc: "Define office/worksite addresses with radius coverage for geo-fencing" },
//         { title: "Reason Master", desc: "Create and manage standardized reasons for employee requests (late check-in, early check-out, etc.)" }
//       ]
//     }
//   ];

//   const employeeFeatures = [
//     {
//       category: "🏠 Dashboard & Navigation",
//       icon: "🏠",
//       features: [
//         { title: "Home Dashboard", desc: "Personalized welcome screen with quick navigation to Attendance and My Serv modules" },
//         { title: "My SERV Dashboard", desc: "Central hub for Attendance, My Track, My Request, Type of Request, My Task, Events, and Rewards" }
//       ]
//     },
//     {
//       category: "⏰ Attendance Features",
//       icon: "⏰",
//       features: [
//         { title: "Attendance Page", desc: "Display employee details with Biometric and Manual check-in options" },
//         { title: "Live Timer", desc: "Track work hours in real-time during shift" },
//         { title: "Late Check-in", desc: "Mark attendance when arriving late with reason (emergency, personal, traffic)" },
//         { title: "Location Services Prompt", desc: "GPS verification to ensure accurate attendance location" },
//         { title: "Check-Out", desc: "End work hours with automatic total hours calculation" }
//       ]
//     },
//     {
//       category: "📅 My Attendance",
//       icon: "📅",
//       features: [
//         { title: "Monthly Calendar View", desc: "Color-coded attendance (Green=Present, Red=Absent, Yellow=Leave, Blue=Holiday, Purple=Week Off, Light Yellow=Half Day)" },
//         { title: "Summary Statistics", desc: "Count of Present, Absent, Leave, Late Check-ins, Early Check-outs, and Permissions" },
//         { title: "Daily Attendance Detail", desc: "View date, check-in/out times, permission time, status, overtime, shift group, and total hours" }
//       ]
//     },
//     {
//       category: "🗺️ Location Tracking",
//       icon: "🗺️",
//       features: [
//         { title: "My Track", desc: "View location history during work hours with map view, timestamps, movement routes, and date filters" }
//       ]
//     },
//     {
//       category: "📋 Request Management",
//       icon: "📋",
//       features: [
//         { title: "My Request", desc: "View all submitted requests with type, date, time, reason, and approval status" },
//         { title: "Type of Requests", desc: "Submit Leave Type, Permission Time, Over Time, Half Day Time, and Comp Off requests" }
//       ]
//     },
//     {
//       category: "✅ Tasks & Updates",
//       icon: "✅",
//       features: [
//         { title: "My Tasks", desc: "View assigned tasks with title, description, due date, creator, and creation time. Upload task-related files" },
//         { title: "Daily Update", desc: "Submit daily work progress descriptions for admin review" },
//         { title: "Event Updates", desc: "View company events with name, dates, and location" },
//         { title: "My Rewards", desc: "Track personal achievements and recognitions with details" }
//       ]
//     },
//     {
//       category: "👤 Profile & Settings",
//       icon: "👤",
//       features: [
//         { title: "Profile", desc: "View details with options for Change Password, Language Selection, Privacy Policy, Terms & Conditions, Permissions, and Feedback" },
//         { title: "Change Password", desc: "Secure password update with validation (8+ characters, lowercase, uppercase, number, special character)" },
//         { title: "Language Selection", desc: "Multi-language support for accessibility" },
//         { title: "Permissions", desc: "Manage Location, Camera, Activity Recognition, and Notification permissions" },
//         { title: "Feedback", desc: "Submit suggestions, complaints, or comments directly to admins" },
//         { title: "Log Out", desc: "Secure sign-out with confirmation popup" }
//       ]
//     }
//   ];

//   const comparisonData = [
//     { category: "Attendance Marking", employee: "✓ Biometric/Manual", admin: "✓ View All Records", capability: "GPS Verification" },
//     { category: "Leave Management", employee: "✓ Submit Requests", admin: "✓ Approve/Reject", capability: "Multiple Leave Types" },
//     { category: "Location Tracking", employee: "✓ View Own History", admin: "✓ View All Employees", capability: "Geofencing & Maps" },
//     { category: "Task Management", employee: "✓ View & Update", admin: "✓ Assign & Monitor", capability: "Daily Progress Tracking" },
//     { category: "Reports & Analytics", employee: "✓ Personal Reports", admin: "✓ All Reports & Export", capability: "Customizable Date Ranges" },
//     { category: "Employee Management", employee: "✗ View Only", admin: "✓ Full CRUD Access", capability: "Lifecycle Management" },
//     { category: "Rewards & Recognition", employee: "✓ View Own Rewards", admin: "✓ Create & Manage", capability: "Performance Tracking" },
//     { category: "Feedback System", employee: "✓ Submit Feedback", admin: "✓ View All Feedback", capability: "Two-way Communication" }
//   ];

//   const benefits = [
//     { title: "Accuracy & Compliance", text: "GPS-based location verification and biometric authentication ensure authentic attendance records and prevent proxy check-ins." },
//     { title: "Real-time Monitoring", text: "Live dashboards, instant notifications, and real-time approval workflows keep admins informed of all workforce activities." },
//     { title: "Transparency & Accountability", text: "Complete audit trails, location tracking history, and detailed request logs ensure full transparency in attendance management." },
//     { title: "Efficiency & Automation", text: "Automated report generation, scheduled tasks, and streamlined approval processes reduce manual work by 80%." },
//     { title: "Employee Empowerment", text: "Self-service features for leave requests, task tracking, and feedback submission improve employee satisfaction and engagement." },
//     { title: "Data-Driven Insights", text: "Comprehensive analytics and customizable reports enable better decision-making for workforce planning and performance evaluation." }
//   ];

//   return (
//     <div className="serv-page">
//       {/* Hero Section */}
//       <div className="serv-hero">
//         <h1 className="serv-hero-title">SERV Attendance Management App</h1>
//         <p className="serv-hero-subtitle">A Complete Employee Attendance & Workforce Management Solution</p>
//         <p className="serv-hero-description">
//           SERV Attendance App is a comprehensive, location-based attendance management system 
//           designed to streamline employee tracking, leave management, task assignments, and 
//           performance monitoring. With biometric support, geofencing, and real-time analytics, 
//           it ensures accuracy, transparency, and efficiency in workforce management.
//         </p>
//       </div>

//       {/* Stats Section */}
//       <div className="serv-stats">
//         <div className="stat-item">
//           <span className="stat-number">2</span>
//           <span className="stat-label">User Roles<br/>(Employee & Admin)</span>
//         </div>
//         <div className="stat-item">
//           <span className="stat-number">50+</span>
//           <span className="stat-label">Features & Modules</span>
//         </div>
//         <div className="stat-item">
//           <span className="stat-number">GPS</span>
//           <span className="stat-label">Location Tracking</span>
//         </div>
//         <div className="stat-item">
//           <span className="stat-number">24/7</span>
//           <span className="stat-label">Real-time Updates</span>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="serv-content">
//         {/* Admin Features */}
//         <div className="section-header">
//           <h2 className="section-title">
//             <span className="section-icon">👨‍💼</span>
//             Admin Dashboard Features
//           </h2>
//         </div>

//         <div className="category-container">
//           <div className="category-zigzag">
//             {adminFeatures.map((category, idx) => (
//               <div key={idx} className="category-block">
//                 <div className="category-visual">{category.icon}</div>
//                 <div className="category-content">
//                   <h3 className="category-title">{category.category}</h3>
//                   <ul className="category-features">
//                     {category.features.map((feature, fIdx) => (
//                       <li key={fIdx}>
//                         <strong>{feature.title}:</strong> {feature.desc}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Employee Features */}
//         <div className="section-header">
//           <h2 className="section-title">
//             <span className="section-icon">📱</span>
//             Employee Mobile App Features
//           </h2>
//         </div>

//         <div className="category-container">
//           <div className="category-zigzag">
//             {employeeFeatures.map((category, idx) => (
//               <div key={idx} className="category-block">
//                 <div className="category-visual">{category.icon}</div>
//                 <div className="category-content">
//                   <h3 className="category-title">{category.category}</h3>
//                   <ul className="category-features">
//                     {category.features.map((feature, fIdx) => (
//                       <li key={fIdx}>
//                         <strong>{feature.title}:</strong> {feature.desc}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Benefits Section */}
//         <div className="section-header">
//           <h2 className="section-title">
//             <span className="section-icon">✨</span>
//             Key Benefits
//           </h2>
//         </div>

//         <div className="benefits-grid">
//           {benefits.map((benefit, idx) => (
//             <div key={idx} className="benefit-box">
//               <h4 className="benefit-title">{benefit.title}</h4>
//               <p className="benefit-text">{benefit.text}</p>
//             </div>
//           ))}
//         </div>

//         {/* Comparison Table */}
//         <div className="section-header">
//           <h2 className="section-title">
//             <span className="section-icon">📋</span>
//             Feature Comparison Table
//           </h2>
//         </div>

//         <div className="comparison-table-wrapper">
//           <table className="comparison-table">
//             <thead>
//               <tr>
//                 <th>Feature Category</th>
//                 <th>Employee Access</th>
//                 <th>Admin Access</th>
//                 <th>Key Capability</th>
//               </tr>
//             </thead>
//             <tbody>
//               {comparisonData.map((row, idx) => (
//                 <tr key={idx}>
//                   <td>{row.category}</td>
//                   <td>{row.employee}</td>
//                   <td>{row.admin}</td>
//                   <td>{row.capability}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Why Choose Section */}
//         <div className="why-choose">
//           <h2 className="why-choose-title">🚀 Why Choose SERV Attendance App?</h2>
//           <div className="why-choose-list">
//             <div className="why-choose-item">
//               <strong>Complete Solution</strong>
//               From basic check-in/out to advanced analytics and workforce planning
//             </div>
//             <div className="why-choose-item">
//               <strong>Mobile-First Design</strong>
//               Optimized for employees on the go with offline capabilities
//             </div>
//             <div className="why-choose-item">
//               <strong>Scalable Architecture</strong>
//               Suitable for small teams to large enterprises
//             </div>
//             <div className="why-choose-item">
//               <strong>Customizable</strong>
//               Flexible shift configurations, custom leave types, and branded experience
//             </div>
//             <div className="why-choose-item">
//               <strong>Secure & Compliant</strong>
//               Role-based access control, encrypted data, and audit logs
//             </div>
//             <div className="why-choose-item">
//               <strong>User-Friendly</strong>
//               Intuitive interface requiring minimal training
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ServAttendance;



import React from 'react';
import { useNavigate } from "react-router-dom";
import './ServAttendance.css';

const ServAttendance = () => {
  const navigate = useNavigate();

  const adminFeatures = [
    {
      icon: "🔐",
      title: "Authentication & Security",
      items: [
        { name: "Dual-Role Login", desc: "Separate dashboards for employees and admins with secure authentication" },
        { name: "Password Recovery", desc: "OTP-based password reset via registered email" },
        { name: "Role-Based Access", desc: "Granular permissions and access control" }
      ]
    },
    {
      icon: "📊",
      title: "Attendance Management",
      items: [
        { name: "Real-Time Tracking", desc: "Live view of checked-in, present, and absent employees" },
        { name: "Approval Workflow", desc: "Manage pending attendance correction requests" },
        { name: "Detailed Records", desc: "Complete logs with shift, location, GPS coordinates, and status" }
      ]
    },
    {
      icon: "📍",
      title: "Location & Geofencing",
      items: [
        { name: "GPS Tracking", desc: "Accurate location capture with latitude and longitude" },
        { name: "Branch Verification", desc: "Google Maps integration for location comparison" },
        { name: "Radius Validation", desc: "Automatic distance calculation and validation" }
      ]
    },
    {
      icon: "📋",
      title: "Leave & Request Management",
      items: [
        { name: "Request Processing", desc: "Approve/reject late check-in, early check-out, and remote work" },
        { name: "Smart Filters", desc: "Filter by leave type, permission, overtime, and location" },
        { name: "Status Dashboard", desc: "Track all requests with pending, approved, and rejected tabs" }
      ]
    },
    {
      icon: "👥",
      title: "Employee Management",
      items: [
        { name: "Employee Lifecycle", desc: "Complete CRUD operations from onboarding to exit" },
        { name: "Dashboard Analytics", desc: "View active, inactive, suspended, and relieved counts" },
        { name: "Report Scheduler", desc: "Automated performance and attendance reports" }
      ]
    },
    {
      icon: "📈",
      title: "Reports & Analytics",
      items: [
        { name: "Custom Reports", desc: "Generate reports with flexible date range filters" },
        { name: "Attendance Metrics", desc: "Track active, on leave, late, early check-out, and half-day" },
        { name: "Export Options", desc: "Download reports in multiple formats for analysis" }
      ]
    },
    {
      icon: "🎯",
      title: "Additional Modules",
      items: [
        { name: "Task Management", desc: "Assign and track employee tasks with daily progress" },
        { name: "Rewards System", desc: "Recognize achievements and record performance" },
        { name: "Feedback Portal", desc: "Collect and manage employee feedback centrally" },
        { name: "Event Management", desc: "Create and broadcast organizational events" }
      ]
    },
    {
      icon: "⚙️",
      title: "Settings & Configuration",
      items: [
        { name: "Shift Configuration", desc: "Create custom shifts with flexible timings" },
        { name: "Leave Types", desc: "Define planned, sick, and emergency leave categories" },
        { name: "Geofence Setup", desc: "Configure office locations with radius coverage" },
        { name: "Reason Management", desc: "Create standardized reasons for requests" }
      ]
    }
  ];

  const employeeFeatures = [
    {
      icon: "🏠",
      title: "Dashboard & Navigation",
      items: [
        { name: "Personalized Dashboard", desc: "Quick access to all modules with intuitive navigation" },
        { name: "My SERV Hub", desc: "Centralized view of attendance, tasks, requests, and rewards" }
      ]
    },
    {
      icon: "⏰",
      title: "Attendance Features",
      items: [
        { name: "Smart Check-In", desc: "Biometric and manual attendance with GPS verification" },
        { name: "Live Timer", desc: "Real-time work hour tracking during shift" },
        { name: "Late Check-In", desc: "Mark attendance with valid reasons when arriving late" },
        { name: "Auto Check-Out", desc: "Automatic calculation of total hours worked" }
      ]
    },
    {
      icon: "📅",
      title: "My Attendance",
      items: [
        { name: "Calendar View", desc: "Color-coded monthly attendance visualization" },
        { name: "Summary Stats", desc: "Track present, absent, leave, and permission counts" },
        { name: "Daily Details", desc: "View check-in/out times, overtime, and shift information" }
      ]
    },
    {
      icon: "🗺️",
      title: "Location Tracking",
      items: [
        { name: "Location History", desc: "View movement routes with timestamps and map view" },
        { name: "Date Filters", desc: "Filter location history by specific date ranges" }
      ]
    },
    {
      icon: "📋",
      title: "Request Management",
      items: [
        { name: "Request Tracking", desc: "Monitor all submitted requests with approval status" },
        { name: "Quick Submissions", desc: "Submit leave, permission, overtime, and comp-off requests" }
      ]
    },
    {
      icon: "✅",
      title: "Tasks & Updates",
      items: [
        { name: "Task Management", desc: "View assigned tasks with due dates and file uploads" },
        { name: "Daily Updates", desc: "Submit work progress for admin review" },
        { name: "Events & Rewards", desc: "Stay informed about company events and personal achievements" }
      ]
    },
    {
      icon: "👤",
      title: "Profile & Settings",
      items: [
        { name: "Profile Management", desc: "Update personal information and preferences" },
        { name: "Security Settings", desc: "Change password with strong validation" },
        { name: "App Permissions", desc: "Manage location, camera, and notification access" },
        { name: "Feedback", desc: "Submit suggestions and complaints directly to admins" }
      ]
    }
  ];

  const benefits = [
    {
      title: "Accuracy & Compliance",
      text: "GPS-based verification and biometric authentication ensure authentic attendance records and prevent proxy check-ins."
    },
    {
      title: "Real-Time Insights",
      text: "Live dashboards provide instant visibility into workforce attendance, location, and productivity metrics."
    },
    {
      title: "Automated Workflows",
      text: "Streamline approval processes, reduce manual work, and eliminate paperwork with digital request management."
    },
    {
      title: "Enhanced Productivity",
      text: "Task assignment, daily updates, and performance tracking keep teams aligned and accountable."
    },
    {
      title: "Cost Efficiency",
      text: "Reduce administrative overhead and improve resource allocation with automated reporting and analytics."
    },
    {
      title: "Employee Satisfaction",
      text: "User-friendly mobile app with self-service features improves employee experience and engagement."
    }
  ];

  const comparisonData = [
    {
      category: "Attendance Marking",
      employee: "✓ Biometric/Manual Check-In",
      admin: "✓ View All Employee Records",
      capability: "GPS & Location Verification"
    },
    {
      category: "Leave Management",
      employee: "✓ Submit Leave Requests",
      admin: "✓ Approve/Reject Requests",
      capability: "Multiple Leave Types"
    },
    {
      category: "Location Tracking",
      employee: "✓ View Personal History",
      admin: "✓ Track All Employees",
      capability: "Geofencing & Google Maps"
    },
    {
      category: "Task Management",
      employee: "✓ View & Update Tasks",
      admin: "✓ Assign & Monitor Tasks",
      capability: "Daily Progress Tracking"
    },
    {
      category: "Reports & Analytics",
      employee: "✓ Personal Reports",
      admin: "✓ Generate & Export Reports",
      capability: "Customizable Date Ranges"
    },
    {
      category: "Employee Management",
      employee: "✗ View Only",
      admin: "✓ Full CRUD Operations",
      capability: "Complete Lifecycle Management"
    },
    {
      category: "Rewards & Recognition",
      employee: "✓ View Personal Rewards",
      admin: "✓ Create & Manage Rewards",
      capability: "Performance Tracking"
    },
    {
      category: "Feedback System",
      employee: "✓ Submit Feedback",
      admin: "✓ View All Feedback",
      capability: "Two-Way Communication"
    }
  ];

  const whyChoose = [
    {
      title: "Complete Solution",
      text: "End-to-end attendance management from check-in to analytics and workforce planning."
    },
    {
      title: "Mobile-First Design",
      text: "Optimized for employees on the go with offline capabilities and responsive interface."
    },
    {
      title: "Scalable Architecture",
      text: "Suitable for organizations of all sizes, from small teams to large enterprises."
    },
    {
      title: "Customizable Platform",
      text: "Flexible configurations for shifts, leave types, and branded user experience."
    },
    {
      title: "Secure & Compliant",
      text: "Role-based access control, encrypted data storage, and comprehensive audit logs."
    },
    {
      title: "Minimal Training Required",
      text: "Intuitive interface that requires minimal training for quick adoption across teams."
    }
  ];

  return (
    <div className="serv-page">
      {/* Header Section */}
      <header className="serv-header">
        <div className="header-content">
          <h1 className="serv-title">SERV Attendance Management System</h1>
          <p className="serv-subtitle">
            Professional Workforce Management Platform
          </p>
          <p className="serv-description">
            A comprehensive, GPS-enabled attendance tracking solution designed for modern organizations. 
            SERV combines advanced geolocation technology, biometric authentication, and real-time analytics 
            to deliver accurate, transparent, and efficient workforce management. Perfect for businesses 
            seeking to automate attendance, streamline approvals, and gain actionable insights into 
            employee productivity.
          </p>

          {/* ✅ NEW: Back to Solutions button */}
          <button
            onClick={() => navigate("/solutions")}
            style={{
              marginTop: "20px",
              padding: "10px 22px",
              background: "#00333d",
              border: "2px solid #00333d",
              borderRadius: "30px",
              color: "white",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            ← Back to Solutions
          </button>
        </div>
      </header>

      {/* Stats Section */}
      <div className="stats-container">
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-number">2</span>
            <span className="stat-label">User Roles</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">50+</span>
            <span className="stat-label">Features</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">GPS</span>
            <span className="stat-label">Tracking</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Support</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="main-content">
        {/* Admin Features */}
        <section className="features-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-icon">👨‍💼</span>
              Admin Dashboard Features
            </h2>
            <p className="section-subtitle">
              Comprehensive tools for workforce management and operational oversight
            </p>
          </div>
          <div className="features-grid">
            {adminFeatures.map((feature, idx) => (
              <div key={idx} className="feature-card">
                <span className="feature-icon">{feature.icon}</span>
                <h3 className="feature-title">{feature.title}</h3>
                <ul className="feature-list">
                  {feature.items.map((item, itemIdx) => (
                    <li key={itemIdx}>
                      <strong>{item.name}:</strong> {item.desc}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Employee Features */}
        <section className="features-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-icon">📱</span>
              Employee Mobile App Features
            </h2>
            <p className="section-subtitle">
              Intuitive mobile experience for seamless attendance and task management
            </p>
          </div>
          <div className="features-grid">
            {employeeFeatures.map((feature, idx) => (
              <div key={idx} className="feature-card">
                <span className="feature-icon">{feature.icon}</span>
                <h3 className="feature-title">{feature.title}</h3>
                <ul className="feature-list">
                  {feature.items.map((item, itemIdx) => (
                    <li key={itemIdx}>
                      <strong>{item.name}:</strong> {item.desc}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="benefits-content">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-icon">✨</span>
              Key Benefits
            </h2>
            <p className="section-subtitle">
              Transform your attendance management with powerful features
            </p>
          </div>
          <div className="benefits-grid">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="benefit-card">
                <h4 className="benefit-title">{benefit.title}</h4>
                <p className="benefit-text">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <main className="main-content">
        <section className="comparison-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-icon">📋</span>
              Feature Comparison Matrix
            </h2>
            <p className="section-subtitle">
              Understand role-based access and capabilities
            </p>
          </div>
          <div className="table-container">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Feature Category</th>
                  <th>Employee Access</th>
                  <th>Admin Access</th>
                  <th>Key Capability</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.category}</td>
                    <td>{row.employee}</td>
                    <td>{row.admin}</td>
                    <td>{row.capability}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Why Choose Section */}
      <section className="why-choose-section">
        <div className="why-choose-content">
          <h2 className="why-choose-title">Why Choose SERV Attendance?</h2>
          <div className="why-choose-grid">
            {whyChoose.map((item, idx) => (
              <div key={idx} className="why-choose-card">
                <h4 className="why-choose-card-title">{item.title}</h4>
                <p className="why-choose-card-text">{item.text}</p>
              </div>
            ))}
          </div>

          {/* ✅ NEW: Back to Solutions button (bottom) */}
          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <button
              onClick={() => navigate("/solutions")}
              style={{
                padding: "10px 22px",
                background: "#00333d",
                border: "none",
                borderRadius: "30px",
                color: "white",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              ← Back to Solutions
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServAttendance;