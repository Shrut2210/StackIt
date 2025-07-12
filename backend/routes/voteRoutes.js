const express = require("express");

function voteRoutes(supabase) {
    const router = express.Router();

    // ➕ Cast or update a vote
    router.post("/", async (req, res) => {
        const { answer_id, user_id, vote } = req.body;

        if (!answer_id || !user_id || ![0, 1].includes(vote)) {
            return res.status(400).json({
                status: 400,
                message: "answer_id, user_id and valid vote (0 or 1) are required",
            });
        }

        try {
            // check if vote exists
            const { data: existing } = await supabase
                .from("votes")
                .select("*")
                .eq("answer_id", answer_id)
                .eq("user_id", user_id)
                .maybeSingle();

            if (existing) {
                const { error } = await supabase
                    .from("votes")
                    .update({ vote })
                    .eq("id", existing.id);

                if (error) throw error;

                return res.status(200).json({
                    status: 200,
                    message: "Vote updated successfully",
                });
            }

            const { error } = await supabase
                .from("votes")
                .insert([{ answer_id, user_id, vote }]);

            if (error) throw error;

            res.status(201).json({
                status: 201,
                message: "Vote recorded successfully",
            });
        } catch (err) {
            res.status(500).json({ status: 500, message: err.message });
        }
    });

    // 📥 Get vote count for an answer
    router.get("/answer/:answerId", async (req, res) => {
        const { answerId } = req.params;

        try {
            const { data: upvotes } = await supabase
                .from("votes")
                .select("*", { count: "exact", head: true })
                .eq("answer_id", answerId)
                .eq("vote", 1);

            const { data: downvotes } = await supabase
                .from("votes")
                .select("*", { count: "exact", head: true })
                .eq("answer_id", answerId)
                .eq("vote", 0);

            res.status(200).json({
                status: 200,
                message: "Vote count fetched",
                data: {
                    upvotes: upvotes?.count || 0,
                    downvotes: downvotes?.count || 0,
                },
            });
        } catch (err) {
            res.status(500).json({ status: 500, message: err.message });
        }
    });

    // 📊 Get vote summary (upvotes and downvotes) for all answers
    router.get("/summary", async (req, res) => {
        try {
            const { data, error } = await supabase
                .from("votes")
                .select("answer_id, vote");

            if (error) throw error;

            const summary = {};

            data.forEach(({ answer_id, vote }) => {
                if (!summary[answer_id]) {
                    summary[answer_id] = { upvotes: 0, downvotes: 0 };
                }
                if (vote === 1) {
                    summary[answer_id].upvotes += 1;
                } else {
                    summary[answer_id].downvotes += 1;
                }
            });

            res.status(200).json({
                status: 200,
                message: "Vote summary fetched",
                data: summary, // e.g., { "2": { upvotes: 3, downvotes: 1 }, "3": { ... } }
            });
        } catch (err) {
            res.status(500).json({ status: 500, message: err.message });
        }
    });

    // ✅ Get upvote and downvote count for a specific answer_id
    router.get("/answer/:answerId/counts", async (req, res) => {
        const { answerId } = req.params;

        try {
            // Fetch all votes for that answer
            const { data, error } = await supabase
                .from("votes")
                .select("vote")
                .eq("answer_id", answerId);

            if (error) throw error;

            let upvotes = 0;
            let downvotes = 0;

            data.forEach(v => {
                if (v.vote === 1) upvotes++;
                else if (v.vote === 0) downvotes++;
            });

            res.status(200).json({
                status: 200,
                message: `Vote count for answer_id ${answerId}`,
                data: {
                    answer_id: parseInt(answerId),
                    upvotes,
                    downvotes,
                },
            });
        } catch (err) {
            res.status(500).json({ status: 500, message: err.message });
        }
    });

    return router;
}

module.exports = voteRoutes;