const express = require("express");
const bcrypt = require("bcrypt");
const multer = require("multer");
const uploadImage = require("../utils/uploadImage");

const upload = multer({ dest: "uploads/" });

function userRoutes(supabase) {
    const router = express.Router();

    // Upload Image (Separate Endpoint)
    router.post("/upload", upload.single("avatar"), async (req, res) => {
        try {
            if (!req.file) return res.status(400).json({ status: 400, message: "No file uploaded" });
            const url = await uploadImage(req.file);
            res.status(200).json({ status: 200, message: "Image uploaded", url });
        } catch (err) {
            res.status(500).json({ status: 500, message: err.message });
        }
    });

    // Create user (avatar_url is string from frontend)
    router.post("/", async (req, res) => {
        try {
            const { email, password, username, avatar_url } = req.body;

            // Check for required fields
            if (!email || !password || !username) {
                return res.status(400).json({
                    status: 400,
                    message: "email, password, and username are required",
                });
            }

            // Check for unique email and username
            const { data: emailCheck } = await supabase
                .from("users")
                .select("id")
                .eq("email", email)
                .single();

            const { data: usernameCheck } = await supabase
                .from("users")
                .select("id")
                .eq("username", username)
                .single();

            if (emailCheck)
                return res.status(400).json({ status: 400, message: "Email already exists" });
            if (usernameCheck)
                return res.status(400).json({ status: 400, message: "Username already exists" });

            // ✅ Hash the password
            const password_hash = await bcrypt.hash(password, 10);
            const created_at = new Date().toISOString();

            const { data, error } = await supabase
                .from("users")
                .insert([{ email, password_hash, username, avatar_url, created_at }])
                .select("id");

            if (error) throw error;

            res.status(201).json({
                status: 201,
                message: "User created successfully",
                id: data[0].id,
            });
        } catch (err) {
            res.status(500).json({ status: 500, message: err.message });
        }
    });



    // Get all users
    router.get("/", async (req, res) => {
        try {
            const { data, error } = await supabase.from("users").select("*");
            if (error) throw error;
            res.status(200).json({ status: 200, message: "Fetched all users", data });
        } catch (err) {
            res.status(500).json({ status: 500, message: err.message });
        }
    });

    // Get user by ID
    router.get("/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const { data, error } = await supabase.from("users").select("*").eq("id", id).single();

            if (error) return res.status(404).json({ status: 404, message: "User not found" });
            res.status(200).json({ status: 200, message: "User fetched successfully", data });
        } catch (err) {
            res.status(500).json({ status: 500, message: err.message });
        }
    });

    // Update user
    router.put("/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const { email, username, password, avatar_url } = req.body;

            const updates = {};
            if (email) updates.email = email;
            if (username) updates.username = username;
            if (password) updates.password_hash = await bcrypt.hash(password, 10);
            if (avatar_url) updates.avatar_url = avatar_url;

            const { data, error } = await supabase
                .from("users")
                .update(updates)
                .eq("id", id)
                .select();

            if (error) return res.status(400).json({ status: 400, message: error.message });
            res.status(200).json({ status: 200, message: "User updated successfully", data });
        } catch (err) {
            res.status(500).json({ status: 500, message: err.message });
        }
    });

    // Delete user
    router.delete("/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const { error } = await supabase.from("users").delete().eq("id", id);
            if (error) throw error;
            res.status(200).json({ status: 200, message: "User deleted successfully" });
        } catch (err) {
            res.status(500).json({ status: 500, message: err.message });
        }
    });

    return router;
}

module.exports = userRoutes;