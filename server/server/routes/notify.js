import express from "express";
import { fetchUpcomingDeadlines } from "../../db/fetchFromDatabase.js";
import { sendUserReminder } from "../../services/mailer.js";

const router = express.Router();

router.get("/deadlines", async (req, res) => {
    const clientSecret = req.headers["x-cron-secret"] || req.query.secret;
    if (clientSecret !== process.env.CRON_SECRET) {
        return res.status(401).json({
            error: "Unauthorized trigger."
        });
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        return res.status(500).json({
            success: false,
            error: "SMTP credentials (SMTP_USER and SMTP_PASS) are not configured in environment variables."
        });
    }

    try {
        const rows = await fetchUpcomingDeadlines(3);

        if (rows.length === 0) {
            return res.status(200).json({ success: true, message: "No upcoming deadlines to notify." });
        }

        const userMap = new Map();
        for (const row of rows) {
            if (!userMap.has(row.user_id)) {
                userMap.set(row.user_id, {
                    email: row.user_email,
                    name: row.first_name || "Student",
                    assignments: []
                });
            }

            userMap.get(row.user_id).assignments.push(row);
        }

        let sentCount = 0;
        const errors = [];

        for (const [userId, userData] of userMap.entries()) {
            try {
                await sendUserReminder(userData.email, userData.name, userData.assignments);
                sentCount++;
                console.log(`Sent reminder email to ${userData.email} (${userData.assignments.length} assignments)`);
            } catch (mailErr) {
                console.error(`Failed to send email to ${userData.email}:`, mailErr.message);
                errors.push({ email: userData.email, error: mailErr.message });
            }
        }

        return res.status(200).json({
            success: true,
            message: `Dispatched deadline reminders to ${sentCount} user(s).`,
            totalUsersNotified: sentCount,
            errors: errors.length > 0 ? errors : undefined
        });
    } catch (error) {
        console.error("Failed to process deadline notifications:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
})


export default router;