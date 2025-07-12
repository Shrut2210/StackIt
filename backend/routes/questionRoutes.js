const express = require("express");
const multer = require("multer");
const uploadImage = require("../utils/uploadImage");

const upload = multer({ dest: "uploads/" });

function questionRoutes(supabase) {
  const router = express.Router();

  // Upload image for question
  router.post("/upload", upload.single("image"), async (req, res) => {
    console.log(req.file);

    try {
      if (!req.file)
        return res.status(400).json({ message: "No file uploaded" });

      const file = req.file;
      console.log("Received file:", file);

      const fileName = `question-images/${Date.now()}-${file.originalname}`;
      console.log("Uploading image:", fileName);

      const { data, error } = await supabase.storage
        .from("question-images") // your bucket name
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });
      console.log("Upload response:", data, error);

      if (error) throw error;

      const r = await supabase.storage
        .from("question-images")
        .getPublicUrl(fileName);
      console.log("Image public URL:", r.data.publicUrl);

      res.status(200).json({
        status: 200,
        message: "Image uploaded to Supabase",
        url: r.data.publicUrl,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Create a question
  router.post("/", async (req, res) => {
    try {
      const { author_id, title, description, tags, image_url } = req.body;

      if (!author_id || !title) {
        return res
          .status(400)
          .json({ status: 400, message: "author_id and title are required" });
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
        id: data[0].id,
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
      res
        .status(200)
        .json({ status: 200, message: "Fetched all questions", data });
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

      if (error)
        return res
          .status(404)
          .json({ status: 404, message: "Question not found" });
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
      res
        .status(200)
        .json({ status: 200, message: "Question deleted successfully" });
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

  // get question by ID with answers
  router.get("/:id/answers", async (req, res) => {
    try {
      const { id } = req.params;

      // Fetch question details
      const { data: question, error: questionError } = await supabase
        .from("questions")
        .select("*")
        .eq("id", id)
        .single();

      if (questionError) {
        return res
          .status(404)
          .json({ status: 404, message: "Question not found" });
      }

      // Fetch answers for the question
      const { data: answers, error: answersError } = await supabase
        .from("answers")
        .select("*")
        .eq("question_id", id)
        .order("created_at", { ascending: false });

      if (answersError) {
        return res
          .status(500)
          .json({ status: 500, message: answersError.message });
      }

      res.status(200).json({
        status: 200,
        message: "Question and answers fetched successfully",
        question,
        answers,
      });
    } catch (err) {
      res.status(500).json({ status: 500, message: err.message });
    }
  });

  return router;
}

module.exports = questionRoutes;
