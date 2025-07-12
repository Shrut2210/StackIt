const express = require("express");
const multer = require("multer");
const uploadImage = require("../utils/uploadImage");

const upload = multer({ dest: "uploads/" });

function answerRoutes(supabase) {
    const router = express.Router();

    // Upload image for answer
    router.post("/upload", upload.single("image"), async (req, res) => {
        try {

            if (!req.file) return res.status(400).json({ status: 400, message: "No image uploaded" });
            const url = await uploadImage(req.file);

            const imageCheckResponse = await fetch("http://localhost:8000/check-image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ path: url }),
            });

            const imageCheckData = await imageCheckResponse.json();

            if (!imageCheckData.result == 'Safe') {
            return res
                .status(403)
                .json({ status: 403, message: "Unsafe image content detected" });
            }

            res.status(200).json({ status: 200, message: "Image uploaded successfully", url });
        } catch (err) {
            res.status(500).json({ status: 500, message: err.message });
        }
    });

    // Create a new answer
    router.post("/", async (req, res) => {
        try {
            const { question_id, author_id, content, image_url } = req.body;

            if (!question_id || !author_id || !content) {
                return res.status(400).json({
                    status: 400,
                    message: "question_id, author_id, and content are required",
                });
            }

            const textCheckResponse = await fetch("http://localhost:8000/check", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: content }),
            });

            const textCheckData = await textCheckResponse.json();

            if (!textCheckData.result == 'safe') {
                return res
                .status(403)
                .json({ status: 403, message: "Unsafe text content detected" });
            }

            const created_at = new Date().toISOString();

            const { data, error } = await supabase
                .from("answers")
                .insert([{ question_id, author_id, content, image_url, created_at }])
                .select("id");

            if (error) throw error;

            res.status(201).json({
                status: 201,
                message: "Answer created successfully",
                id: data[0].id,
            });
        } catch (err) {
            res.status(500).json({ status: 500, message: err.message });
        }
    });

    // Get all answers
    router.get("/", async (req, res) => {
        try {
            const { data, error } = await supabase.from("answers").select("*");
            if (error) throw error;
            res.status(200).json({ status: 200, message: "Fetched all answers", data });
        } catch (err) {
            res.status(500).json({ status: 500, message: err.message });
        }
    });

    // Get answer by ID
    router.get("/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const { data, error } = await supabase.from("answers").select("*").eq("id", id).single();
            if (error) return res.status(404).json({ status: 404, message: "Answer not found" });
            res.status(200).json({ status: 200, message: "Answer fetched", data });
        } catch (err) {
            res.status(500).json({ status: 500, message: err.message });
        }
    });

    // Get answers for a question
    router.get("/question/:questionId", async (req, res) => {
        try {
            const { questionId } = req.params;
            const { data, error } = await supabase
                .from("answers")
                .select("*")
                .eq("question_id", questionId)
                .order("created_at", { ascending: false });

            if (error) throw error;
            res.status(200).json({ status: 200, message: "Answers fetched successfully", data });
        } catch (err) {
            res.status(500).json({ status: 500, message: err.message });
        }
    });

    // Update answer
    router.put("/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const { content, image_url } = req.body;

            const updates = {};
            if (content) updates.content = content;
            if (image_url) updates.image_url = image_url;

            const { data, error } = await supabase
                .from("answers")
                .update(updates)
                .eq("id", id)
                .select();

            if (error) throw error;
            res.status(200).json({ status: 200, message: "Answer updated successfully", data });
        } catch (err) {
            res.status(500).json({ status: 500, message: err.message });
        }
    });

    // Delete answer
    router.delete("/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const { error } = await supabase.from("answers").delete().eq("id", id);
            if (error) throw error;
            res.status(200).json({ status: 200, message: "Answer deleted successfully" });
        } catch (err) {
            res.status(500).json({ status: 500, message: err.message });
        }
    });

    // Get all answers for a specific question
    router.get("/question/:questionId", async (req, res) => {
        try {
            const { questionId } = req.params;

            const { data, error } = await supabase
                .from("answers")
                .select("*")
                .eq("question_id", questionId)
                .order("created_at", { ascending: false });

            if (error) throw error;

            res.status(200).json({
                status: 200,
                message: "Answers fetched successfully",
                data,
            });
        } catch (err) {
            res.status(500).json({ status: 500, message: err.message });
        }
    });


    return router;
}

module.exports = answerRoutes;