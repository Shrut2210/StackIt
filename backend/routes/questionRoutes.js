const express = require("express");
const multer = require("multer");
const uploadImage = require("../utils/uploadImage");

const upload = multer({ dest: "uploads/" });

function questionRoutes(supabase) {
    const router = express.Router();

    // Upload image for question
    router.post("/upload", upload.single("image"), async (req, res) => {
        try {
            if (!req.file) return res.status(400).json({ status: 400, message: "No image file uploaded" });
            const url = await uploadImage(req.file);
            res.status(200).json({ status: 200, message: "Image uploaded successfully", url });
        } catch (err) {
            res.status(500).json({ status: 500, message: err.message });
        }
    });

    // Create a question
    router.post("/", async (req, res) => {
        try {
            const { author_id, title, description, image_url } = req.body;

            if (!author_id || !title) {
                return res.status(400).json({ status: 400, message: "author_id and title are required" });
            }

            const created_at = new Date().toISOString();

            const { data, error } = await supabase
                .from("questions")
                .insert([{ author_id, title, description, image_url, created_at }])
                .select("id");

            if (error) throw error;

            res.status(201).json({
                status: 201,
                message: "Question created successfully",
                id: data[0].id
            });
        } catch (err) {
            res.status(500).json({ status: 500, message: err.message });
        }
    });

    // Get all questions
    router.get("/", async (req, res) => {
        try {
            const { data, error } = await supabase.from("questions").select("*");
            if (error) throw error;
            res.status(200).json({ status: 200, message: "Fetched all questions", data });
        } catch (err) {
            res.status(500).json({ status: 500, message: err.message });
        }
    });

    // Get question by ID
    router.get("/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const { data, error } = await supabase
                .from("questions")
                .select("*")
                .eq("id", id)
                .single();

            if (error) return res.status(404).json({ status: 404, message: "Question not found" });
            res.status(200).json({ status: 200, message: "Question fetched", data });
        } catch (err) {
            res.status(500).json({ status: 500, message: err.message });
        }
    });

    // Update a question
    router.put("/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const { title, description, image_url } = req.body;

            const updates = {};
            if (title) updates.title = title;
            if (description) updates.description = description;
            if (image_url) updates.image_url = image_url;

            const { data, error } = await supabase
                .from("questions")
                .update(updates)
                .eq("id", id)
                .select();

            if (error) throw error;

            res.status(200).json({ status: 200, message: "Question updated", data });
        } catch (err) {
            res.status(500).json({ status: 500, message: err.message });
        }
    });

    // Delete a question
    router.delete("/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const { error } = await supabase.from("questions").delete().eq("id", id);
            if (error) throw error;
            res.status(200).json({ status: 200, message: "Question deleted successfully" });
        } catch (err) {
            res.status(500).json({ status: 500, message: err.message });
        }
    });

    // Get all questions by a specific author (user ID)
    router.get("/user/:userId", async (req, res) => {
        try {
            const { userId } = req.params;

            const { data, error } = await supabase
                .from("questions")
                .select("*")
                .eq("author_id", userId)
                .order("created_at", { ascending: false });

            if (error) throw error;

            res.status(200).json({
                status: 200,
                message: "Questions fetched successfully",
                data,
            });
        } catch (err) {
            res.status(500).json({ status: 500, message: err.message });
        }
    });


    return router;
}

module.exports = questionRoutes;