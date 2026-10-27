import express from "express";
import { fetchCourses, fetchAssignments, fetchUser } from "../../db/fetchFromDatabase.js";

const router = express.Router();

router.get("/courses", async (req, res) => {
    try {
        const userEmail = req.query.email;

        if (!userEmail) {
            return res.status(400).json({
                success: false,
                message: "The 'email' query parameter is required."
            });
        }

        const user = await fetchUser(userEmail);

        if (user.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const courses = await fetchCourses(user[0].id);
        res.status(200).json({ 
            success: true, 
            courses 
        });
    } catch (error) {
        console.error("Failed to fetch courses: ", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch courses."
        });
    }
});

router.get("/assignments", async (req, res) => {
    try {
        const userEmail = req.query.email;
        const userCourseId = req.query.courseId;

        if (!userEmail) {
            return res.status(400).json({
                success: false,
                message: "The 'email' query parameter is required."
            });
        }

        const user = await fetchUser(userEmail);

        if (user.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const assignments = await fetchAssignments(user[0].id, userCourseId);
        res.status(200).json({ 
            success: true, 
            assignments 
        });
    } catch (error) {
        console.error("Failed to fetch assignments: ", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch assignments."
        });
    }
});


export default router;