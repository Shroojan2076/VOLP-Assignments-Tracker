import { fetchUpcomingDeadlines } from "../db/fetchFromDatabase.js";
import { sendUserReminder } from "./mailer.js";
import { config } from "dotenv";

config();

export async function runDeadlineEmailJob() {
    console.log("[Deadline Alerts] Starting deadline reminder dispatch job...");

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.error("[Deadline Alerts] ERROR: Missing SMTP_USER or SMTP_PASS environment variables.");
        process.exit(1);
    }

    try {
        const rows = await fetchUpcomingDeadlines(3);

        if (rows.length === 0) {
            console.log("[Deadline Alerts] No upcoming deadlines found within the next 3 days.");
            return;
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

        console.log(`[Deadline Alerts] Found ${rows.length} assignment(s) across ${userMap.size} user(s).`);

        let sentCount = 0;
        for (const [userId, userData] of userMap.entries()) {
            try {
                await sendUserReminder(userData.email, userData.name, userData.assignments);
                sentCount++;
                console.log(`[Deadline Alerts] Successfully sent reminder to ${userData.email} (${userData.assignments.length} assignments).`);
            } catch (mailErr) {
                console.error(`[Deadline Alerts] Failed to send reminder to ${userData.email}:`, mailErr.message);
            }
        }

        console.log(`[Deadline Alerts] Completed. Total reminder emails dispatched: ${sentCount}.`);
    } catch (err) {
        console.error("[Deadline Alerts] Critical job error:", err);
        process.exit(1);
    }
}

// Automatically execute if run directly via Node CLI
const isDirectRun = process.argv[1] && (
    process.argv[1].endsWith("sendDeadlineEmails.js") || 
    process.argv[1].includes("sendDeadlineEmails")
);

if (isDirectRun) {
    runDeadlineEmailJob()
        .then(() => process.exit(0))
        .catch((err) => {
            console.error(err);
            process.exit(1);
        });
}
