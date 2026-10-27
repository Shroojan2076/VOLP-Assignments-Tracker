import { login, getCourses, getAssignments } from "../api/api.js";
import { fetchAllUsers } from "../db/fetchFromDatabase.js";
import { saveAssignment, saveCourse } from "../db/saveToDatabase.js";
import { parseAssignments, parseCourses, parseUsers } from "../services/parser.js";
import { config } from "dotenv";

config();

export async function allUsersSync() {
    console.log("Starting synchronization...");

    const rawUsers = await fetchAllUsers();
    const users = parseUsers(rawUsers);

    for (const user of users) {
        await singleUserSync(user);
    }
    console.log("Synchronization complete.");
}

export async function singleUserSync(user) {
    console.log(`Syncing User: ${user.firstName} ${user.lastName}`);

    const auth = await login(user.email, user.password);
    await courseSync(auth, user.id);
    console.log(`${user.firstName} ${user.lastName} synchronization complete.`);
}

export async function courseSync(auth, userId) {
    const rawCourses = await getCourses(auth);
    const courses = parseCourses(rawCourses, userId);

    for (const course of courses) {
        try {

            console.log(`Syncing course: ${course.name}`);
            await saveCourse(course);

            await assignmentSync(course, auth, userId);
        } catch (err) {
            console.error(`Skipping course ${course.name} due to error:`, err.message);
        }
    }
}

export async function assignmentSync(course, auth, userId) {
    const rawAssignments = await getAssignments(course, auth);
    const assignments = parseAssignments(rawAssignments, course.courseId, userId);

    for (const assignment of assignments) {
        await saveAssignment(assignment);
    }
}