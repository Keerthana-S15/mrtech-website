// import { db } from "../config/firebase.js";
// import bcrypt from "bcryptjs";

// export const register = async (req, res) => {
//   try {
//     const { fullName, email, phone, password, userType } = req.body;

//     if (!fullName || !email || !phone || !password) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     if (userType === "admin") {
//       return res.status(403).json({ error: "Admin accounts cannot be self-registered" });
//     }

//     const usersRef = db.collection("users");
//     const existingUser = await usersRef.where("email", "==", email).get();

//     if (!existingUser.empty) {
//       return res.status(400).json({ error: "User already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const docRef = await usersRef.add({
//       fullName,
//       email,
//       phone,
//       password: hashedPassword,
//       userType: "customer",
//       createdAt: new Date().toISOString(),
//     });

//     res.json({
//       success: true,
//       message: "Customer registered successfully",
//       id: docRef.id,
//     });
//   } catch (error) {
//     console.error("🔥 Register Error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password)
//       return res.status(400).json({ error: "Email and password are required" });

//     const userSnap = await db.collection("users").where("email", "==", email).get();

//     let user = null;
//     if (!userSnap.empty) {
//       user = userSnap.docs[0].data();
//     } else {
//       const adminSnap = await db.collection("admin").where("email", "==", email).get();
//       if (!adminSnap.empty) {
//         user = adminSnap.docs[0].data();
//       } else {
//         return res.status(400).json({ error: "User not found" });
//       }
//     }

//     const validPassword = await bcrypt.compare(password, user.password);
//     if (!validPassword)
//       return res.status(400).json({ error: "Invalid password" });

//     res.json({
//       success: true,
//       message: "Login successful",
//       user: {
//         fullName: user.fullName,
//         email: user.email,
//         userType: user.userType,
//       },
//     });
//   } catch (error) {
//     console.error("🔥 Login Error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };





// import { db } from "../config/firebase.js";
// import bcrypt from "bcryptjs";

// export const register = async (req, res) => {
//   try {
//     const { fullName, email, phone, password, userType } = req.body;

//     if (!fullName || !email || !phone || !password) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     if (userType === "admin") {
//       return res.status(403).json({ error: "Admin accounts cannot be self-registered" });
//     }

//     const usersRef = db.collection("users");
//     const existingUser = await usersRef.where("email", "==", email).get();

//     if (!existingUser.empty) {
//       return res.status(400).json({ error: "User already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const docRef = await usersRef.add({
//       fullName,
//       email,
//       phone,
//       password: hashedPassword,
//       userType: "customer",
//       createdAt: new Date().toISOString(),
//     });

//     res.json({
//       success: true,
//       message: "Customer registered successfully",
//       id: docRef.id,
//     });
//   } catch (error) {
//     console.error("🔥 Register Error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// export const login = async (req, res) => {
//   try {
//     const { emailOrPhone, password } = req.body;

//     if (!emailOrPhone || !password)
//       return res.status(400).json({ error: "Email and password are required" });

//     let user = null;
//     let userType = "customer";

//     // Email-ல users collection search
//     const emailSnap = await db.collection("users")
//       .where("email", "==", emailOrPhone).get();

//     if (!emailSnap.empty) {
//       user = emailSnap.docs[0].data();
//     } else {
//       // Phone-ல users collection search
//       const phoneSnap = await db.collection("users")
//         .where("phone", "==", emailOrPhone).get();

//       if (!phoneSnap.empty) {
//         user = phoneSnap.docs[0].data();
//       } else {
//         // Admin email search
//         const adminEmailSnap = await db.collection("admin")
//           .where("email", "==", emailOrPhone).get();

//         if (!adminEmailSnap.empty) {
//           user = adminEmailSnap.docs[0].data();
//           userType = "admin";
//         } else {
//           // Admin phone search
//           const adminPhoneSnap = await db.collection("admin")
//             .where("phone", "==", emailOrPhone).get();

//           if (!adminPhoneSnap.empty) {
//             user = adminPhoneSnap.docs[0].data();
//             userType = "admin";
//           } else {
//             return res.status(400).json({ error: "User not found" });
//           }
//         }
//       }
//     }

//     // Password verify
//     const validPassword = await bcrypt.compare(password, user.password);
//     if (!validPassword)
//       return res.status(400).json({ error: "Invalid password" });

//     // Success response
//     res.json({
//       success: true,
//       message: "Login successful",
//       token: "mrtech_" + Date.now(),
//       user: {
//         fullName: user.fullName,
//         email: user.email,
//         phone: user.phone,
//         userType: user.userType || userType,
//       },
//     });
//   } catch (error) {
//     console.error("🔥 Login Error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };







import { db } from "../config/firebase.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generates a real, verifiable JWT (replaces the old fake "mrtech_"+timestamp token)
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const register = async (req, res) => {
  try {
    const { fullName, email, phone, password, userType } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (userType === "admin") {
      return res.status(403).json({ error: "Admin accounts cannot be self-registered" });
    }

    const usersRef = db.collection("users");
    const existingUser = await usersRef.where("email", "==", email).get();

    if (!existingUser.empty) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const docRef = await usersRef.add({
      fullName,
      email,
      phone,
      password: hashedPassword,
      userType: "customer",
      createdAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: "Customer registered successfully",
      id: docRef.id,
    });
  } catch (error) {
    console.error("🔥 Register Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password)
      return res.status(400).json({ error: "Email and password are required" });

    let user = null;
    let userType = "customer";
    let adminDocId = null;

    // Email-ல users collection search
    const emailSnap = await db.collection("users")
      .where("email", "==", emailOrPhone).get();

    if (!emailSnap.empty) {
      user = emailSnap.docs[0].data();
    } else {
      // Phone-ல users collection search
      const phoneSnap = await db.collection("users")
        .where("phone", "==", emailOrPhone).get();

      if (!phoneSnap.empty) {
        user = phoneSnap.docs[0].data();
      } else {
        // Admin email search
        const adminEmailSnap = await db.collection("admin")
          .where("email", "==", emailOrPhone).get();

        if (!adminEmailSnap.empty) {
          user = adminEmailSnap.docs[0].data();
          adminDocId = adminEmailSnap.docs[0].id;
          userType = "admin";
        } else {
          // Admin phone search
          const adminPhoneSnap = await db.collection("admin")
            .where("phone", "==", emailOrPhone).get();

          if (!adminPhoneSnap.empty) {
            user = adminPhoneSnap.docs[0].data();
            adminDocId = adminPhoneSnap.docs[0].id;
            userType = "admin";
          } else {
            return res.status(400).json({ error: "User not found" });
          }
        }
      }
    }

    // Password verify
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ error: "Invalid password" });

    const finalUserType = user.userType || userType;

    // ✅ NEW: Build a real JWT. For admins, this embeds companyId and
    // isSuperAdmin so every future request can be scoped correctly —
    // the old fake token had no way to verify or scope anything.
    let token;
    if (finalUserType === "admin") {
      token = generateToken({
        adminId: adminDocId,
        email: user.email,
        companyId: user.companyId || null,
        isSuperAdmin: user.isSuperAdmin === true,
      });
    } else {
      // Customers don't need company scoping — keep it simple
      token = generateToken({
        email: user.email,
        userType: "customer",
      });
    }

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        userType: finalUserType,
        companyId: user.companyId || null,
        companyName: user.companyName || null,
        isSuperAdmin: user.isSuperAdmin === true,
      },
    });
  } catch (error) {
    console.error("🔥 Login Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ NEW: Creates a new company's admin account. Only MRtech's super admin
// can call this (protected by requireAdmin + requireSuperAdmin middleware
// on the route). This is how you onboard a new company.
export const createCompanyAdmin = async (req, res) => {
  try {
    const { fullName, email, phone, password, companyId, companyName } = req.body;

    if (!fullName || !email || !phone || !password || !companyId || !companyName) {
      return res.status(400).json({
        error: "fullName, email, phone, password, companyId, and companyName are all required",
      });
    }

    const adminRef = db.collection("admin");
    const existing = await adminRef.where("email", "==", email).get();
    if (!existing.empty) {
      return res.status(400).json({ error: "An admin with this email already exists" });
    }

    const existingCompany = await adminRef.where("companyId", "==", companyId).get();
    if (!existingCompany.empty) {
      return res.status(400).json({ error: "This companyId is already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const docRef = await adminRef.add({
      fullName,
      email,
      phone,
      password: hashedPassword,
      userType: "admin",
      companyId,
      companyName,
      isSuperAdmin: false,
      createdAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: `Admin account created for ${companyName}`,
      id: docRef.id,
    });
  } catch (error) {
    console.error("🔥 Create Company Admin Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};