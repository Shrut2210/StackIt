const express = require("express");

function questionTagRoutes(supabase) {
    const router = express.Router();

    // ➕ Add a tag to a question
    router.post("/", async (req, res) => {
        try {
            const { question_id, tag_id } = req.body;

            if (!question_id || !tag_id) {
                return res.status(400).json({
                    status: 400,
                    message: "question_id and tag_id are required",
                });
            }

            const { data: existing } = await supabase
                .from("question_tags")
                .select("*")
                .eq("question_id", question_id)
                .eq("tag_id", tag_id)
                .maybeSingle();

            if (existing) {
                return res.status(400).json({
                    status: 400,
                    message: "This tag is already assigned to the question",
                });
            }

            const { error } = await supabase
                .from("question_tags")
                .insert([{ question_id, tag_id }]);

            if (error) throw error;

            res.status(201).json({
                status: 201,
                message: "Tag added to question",
            });
        } catch (err) {
            res.status(500).json({ status: 500, message: err.message });
        }
    });

    // 📥 Get all tags for a question
    router.get("/question/:questionId", async (req, res) => {
        try {
            const { questionId } = req.params;

            const { data, error } = await supabase
                .from("question_tags")
                .select("tag_id, tags(name)")
                .eq("question_id", questionId);

            if (error) throw error;

            res.status(200).json({
                status: 200,
                message: "Tags fetched for the question",
                data,
            });
        } catch (err) {
            res.status(500).json({ status: 500, message: err.message });
        }
    });

    // Get all questions for a tag
    router.get("/tag/:tagId", async (req, res) => {
        try {
            const { tagId } = req.params;

            const { data, error } = await supabase
                .from("question_tags")
                .select("question_id, questions(title)")
                .eq("tag_id", tagId);

            if (error) throw error;

            res.status(200).json({
                status: 200,
                message: "Questions fetched for the tag",
                data,
            });
        } catch (err) {
            res.status(500).json({ status: 500, message: err.message });
        }
    });

    // 🔍 Get all tags for a given question
    router.get("/question/:questionId", async (req, res) => {
        try {
            const { questionId } = req.params;

            const { data, error } = await supabase
                .from("question_tags")
                .select("tag_id, tags(name)")
                .eq("question_id", questionId);

            if (error) throw error;

            res.status(200).json({
                status: 200,
                message: "Tags fetched for the question",
                data,
            });
        } catch (err) {
            res.status(500).json({ status: 500, message: err.message });
        }
    });


    // Remove a tag from a question
    router.delete("/", async (req, res) => {
        try {
            const { question_id, tag_id } = req.body;

            const { error } = await supabase
                .from("question_tags")
                .delete()
                .eq("question_id", question_id)
                .eq("tag_id", tag_id);

            if (error) throw error;

            res.status(200).json({
                status: 200,
                message: "Tag removed from question",
            });
        } catch (err) {
            res.status(500).json({ status: 500, message: err.message });
        }
    });

    return router;
}

module.exports = questionTagRoutes;