const express = require("express");

function tagRoutes(supabase) {
  const router = express.Router();

  // ➕ Create new tag
  router.post("/", async (req, res) => {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ status: 400, message: "Tag name is required" });
      }

      // Optional: Check for duplicate tag
      const { data: existing } = await supabase
        .from("tags")
        .select("id")
        .eq("name", name)
        .single();

      if (existing) {
        return res.status(400).json({ status: 400, message: "Tag already exists" });
      }

      const { data, error } = await supabase
        .from("tags")
        .insert([{ name }])
        .select("id");

      if (error) throw error;

      res.status(201).json({
        status: 201,
        message: "Tag created successfully",
        id: data[0].id,
      });
    } catch (err) {
      res.status(500).json({ status: 500, message: err.message });
    }
  });

  // 📥 Get all tags
  router.get("/", async (req, res) => {
    try {
      const { data, error } = await supabase.from("tags").select("*").order("name");
      if (error) throw error;
      res.status(200).json({ status: 200, message: "Tags fetched", data });
    } catch (err) {
      res.status(500).json({ status: 500, message: err.message });
    }
  });

  // 🔍 Get tag by ID
  router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { data, error } = await supabase.from("tags").select("*").eq("id", id).single();
      if (error) return res.status(404).json({ status: 404, message: "Tag not found" });
      res.status(200).json({ status: 200, message: "Tag fetched", data });
    } catch (err) {
      res.status(500).json({ status: 500, message: err.message });
    }
  });

  // ✏️ Update tag
  router.put("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      if (!name) return res.status(400).json({ status: 400, message: "Tag name is required" });

      const { data, error } = await supabase
        .from("tags")
        .update({ name })
        .eq("id", id)
        .select();

      if (error) throw error;

      res.status(200).json({ status: 200, message: "Tag updated", data });
    } catch (err) {
      res.status(500).json({ status: 500, message: err.message });
    }
  });

  // 🗑️ Delete tag
  router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;

      const { error } = await supabase.from("tags").delete().eq("id", id);
      if (error) throw error;

      res.status(200).json({ status: 200, message: "Tag deleted successfully" });
    } catch (err) {
      res.status(500).json({ status: 500, message: err.message });
    }
  });

  return router;
}

module.exports = tagRoutes;