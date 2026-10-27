import express from "express";
import { allUsersSync } from "../../sync/sync.js";

const router = express.Router();

function isVolpAvailable() {
    const istTimeStr = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

    const istDate = new Date(istTimeStr);
    const hour = istDate.getHours();

    return hour < 24 && hour >= 7;
}

router.get("/", async (req, res) => {

    const clientSecret = req.headers["x-cron-secret"] || req.query.secret;
    if (clientSecret !== process.env.CRON_SECRET) {
        return res.status(401).json({ error: "Unauthorized cron trigger." });
    }

    if (!isVolpAvailable()) {
        console.log("[VOLP Maintenance] Skipping sync: VOLP portal is offline between 12:00 AM and 07:00 AM IST.");
        return res.status(200).json({
            success: true,
            status: "maintenance_window",
            message: "VOLP portal is offline for daily maintenance between 12:00 AM and 07:00 AM IST. Sync skipped safely."
        });
    }

    try {
        await allUsersSync();
        res.status(200).json({
            response: "Sync Successful."
        })
    } catch (error) {
        console.error("Failed to sync: ", error);

        res.status(500).json({
            error: "Failed to sync."
        });
    }
});

export default router;

