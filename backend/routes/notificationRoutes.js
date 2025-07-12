const express = require("express");

function notificationRoutes(supabase) {
  const router = express.Router();

  // Create notification
  router.post("/", async (req, res) => {
    const { user_id, type, reference_id } = req.body;

    if (!user_id || !type || reference_id === undefined) {
      return res.status(400).json({
        status: 400,
        message: "user_id, type, and reference_id are required",
      });
    }

    try {
      const created_at = new Date().toISOString();

      const { error } = await supabase.from("notifications").insert([
        { user_id, type, reference_id, created_at, is_read: false },
      ]);

      if (error) throw error;

      res.status(201).json({
        status: 201,
        message: "Notification created",
      });
    } catch (err) {
      res.status(500).json({ status: 500, message: err.message });
    }
  });

  // Get all notifications for a user
  router.get("/user/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      res.status(200).json({
        status: 200,
        message: "Notifications fetched",
        data,
      });
    } catch (err) {
      res.status(500).json({ status: 500, message: err.message });
    }
  });

  // Mark a notification as read
  router.put("/:id/read", async (req, res) => {
    const { id } = req.params;

    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);

      if (error) throw error;

      res.status(200).json({
        status: 200,
        message: "Notification marked as read",
      });
    } catch (err) {
      res.status(500).json({ status: 500, message: err.message });
    }
  });

  // Delete a notification
  router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", id);

      if (error) throw error;

      res.status(200).json({
        status: 200,
        message: "Notification deleted",
      });
    } catch (err) {
      res.status(500).json({ status: 500, message: err.message });
    }
  });

  return router;
}

module.exports = notificationRoutes;