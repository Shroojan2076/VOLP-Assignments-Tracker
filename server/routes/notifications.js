import express from 'express';
import { getDeadlineInfo } from '../../services/deadline.js';
import { getNotificationSchedule } from '../../services/notificationSchedule.js';

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const assignments = await getDeadlineInfo();

        const notifications = [];

        for (const assignment of assignments) {
            const schedule = await getNotificationSchedule(assignment);

            notifications.push(...schedule)
        }
        res.json({
            notifications
        });
    } catch (error) {
        console.error("Failed to generate notification schedule:", error);

        res.status(500).json({
            error: "Failed to generate notification schedule"
        });
    }
})

export default router;