require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");


const app = express();

// Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom logging middleware (optional)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use((req, res, next) => {
  req.supabase = supabase;
  next();
});

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes(supabase));

const questionRoutes = require("./routes/questionRoutes");
app.use("/api/questions", questionRoutes(supabase));

const answerRoutes = require("./routes/answerRoutes");
app.use("/api/answers", answerRoutes(supabase));

const tagRoutes = require("./routes/tagRoutes");
app.use("/api/tags", tagRoutes(supabase));

const questionTagRoutes = require("./routes/questionTagRoutes");
app.use("/api/question-tags", questionTagRoutes(supabase));

// 404 Not Found Handler
app.use((req, res) => {
  res.status(404).json({ status: 404, message: "Route not found" });
});

// Global Error Handler (optional)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ status: 500, message: "Internal Server Error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));