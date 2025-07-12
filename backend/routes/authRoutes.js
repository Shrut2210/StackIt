const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Store securely in .env

// 📘 SIGNUP
router.post("/signup", async (req, res) => {
  const { email, password, username, avatar_url } = req.body;
  console.log(email);
  if (!email || !password || !username) {
    console.error("Missing required fields for signup");
    return res.status(400).json({
      status: 400,
      message: "Email, password and username are required",
    });
  }

  try {
    // Check if user already exists
    const { data: existing } = await req.supabase
      .from("users")
      .select("*")
      .or(`email.eq.${email},username.eq.${username}`);

    console.log("Existing users:", existing);

    if (existing) {
      return res.status(400).json({
        status: 400,
        message: "Email or username already exists",
      });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const created_at = new Date().toISOString();
    console.log("Hashed password:", password_hash);
    const { data, error } = await req.supabase
      .from("users")
      .insert([
        {
          email,
          password_hash,
          username,
          avatar_url: avatar_url || "",
          created_at,
        },
      ])
      .select("*");
    console.log("Inserted user data:", data);
    if (error) throw error;

    const token = jwt.sign({ userId: data[0].id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log("User created:", data[0].id);
    res.status(201).json({
      status: 201,
      message: "Signup successful",
      id: data[0].id,
      token,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ status: 500, message: err.message });
  }
});

// 🔐 LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt for email:", email);
  console.log("Request body:", password);
  if (!email || !password) {
    console.error("Missing required fields for login");
    return res.status(400).json({
      status: 400,
      message: "Email and password are required",
    });
  }

  try {
    const { data: user, error } = await req.supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();
    console.log("User data:", user);

    if (error) {
      console.error("Login error:", error);
      return res
        .status(401)
        .json({ status: 401, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res
        .status(401)
        .json({ status: 401, message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log("Login successful for user:", user.id);
    res.status(200).json({
      status: 200,
      message: "Login successful",
      id: user.id,
      token,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
});

module.exports = router;
