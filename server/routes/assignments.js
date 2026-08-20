import express from 'express';
import { getDeadlineInfo } from '../../services/deadline.js';

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const assignments = await getDeadlineInfo();
        res.json({
            assignments
        })
    } catch (error) {
        console.error("Failed to fetch assignments:", error);

        res.status(500).json({
            error: "Failed to fetch assignments"
        });
    }
});

export default router;