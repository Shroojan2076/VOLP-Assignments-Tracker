import express from "express";
import { allUsersSync } from "../../sync/sync.js";

const router = express.Router();

let isSyncInProgress = false;

function isVolpAvailable() {
    const istTimeStr = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

    const istDate = new Date(istTimeStr);
    const hour = istDate.getHours();

    return hour < 24 && hour >= 7;
}

router.get("/", (req, res) => {
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

    if (isSyncInProgress) {
        console.log("[VOLP Sync] Sync requested while a previous sync is still running. Skipping duplicate trigger.");
        return res.status(200).json({
            success: true,
            status: "already_running",
            message: "A sync process is already actively running."
        });
    }

    // Send immediate response so cronjob services (like cron-job.org) do not time out
    res.status(202).json({
        success: true,
        status: "sync_started",
        message: "VOLP background sync initiated successfully."
    });

    // Run scraper in the background
    isSyncInProgress = true;
    allUsersSync()
        .then(() => {
            console.log("[VOLP Sync] Background sync completed successfully.");
        })
        .catch((error) => {
            console.error("[VOLP Sync] Background sync failed:", error);
        })
        .finally(() => {
            isSyncInProgress = false;
        });
});

export default router;

