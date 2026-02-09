import User from "../models/user.js";
import JWT from "jsonwebtoken";

// ================= REGISTER =================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "user"
    });

    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      return res.status(500).json({
        message: "JWT_SECRET is not configured"
      });
    }

    const token = JWT.sign(
      { userId: user._id, role: user.role },
      secretKey,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Registered successfully",
      token
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= Login =================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🔥 READ SECRET AT RUNTIME
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      return res.status(500).json({
        message: "JWT_SECRET is not configured"
      });
    }

    const token = JWT.sign(
      { userId: user._id, role: user.role },
      secretKey,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
