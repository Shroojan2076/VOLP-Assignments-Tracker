import express from 'express';
import { getCourseList } from "../../db/courses.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {

        const courses = await getCourseList();
        res.json({
            courses
        });

    } catch (error) {
        console.error("Failed to fetch courses:", error);
        res.status(500).json({error: "Failed to fetch courses"});
    }
})

export default router;