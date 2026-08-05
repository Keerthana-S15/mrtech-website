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





import { db } from "../config/firebase.js";
import bcrypt from "bcryptjs";

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
          userType = "admin";
        } else {
          // Admin phone search
          const adminPhoneSnap = await db.collection("admin")
            .where("phone", "==", emailOrPhone).get();

          if (!adminPhoneSnap.empty) {
            user = adminPhoneSnap.docs[0].data();
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

    // Success response
    res.json({
      success: true,
      message: "Login successful",
      token: "mrtech_" + Date.now(),
      user: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        userType: user.userType || userType,
      },
    });
  } catch (error) {
    console.error("🔥 Login Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};