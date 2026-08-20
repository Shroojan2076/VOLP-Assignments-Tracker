import dotenv from "dotenv";
import { login, getCourses, getAssignmentList } from "../API/api.js";
import { parseCourses, parseAssignments } from "../services/parser.js";
import { saveCourse } from "../db/courses.js";
import { saveAssignment } from "../db/assignments.js";

dotenv.config();

const username = process.env.VOLP_EMAIL;
const password = process.env.VOLP_PASSWORD;


export async function sync() {

    console.log("Starting synchronization...");

    const auth = await login(username, password);

    const rawCourses = await getCourses(auth);
    const courses = parseCourses(rawCourses);
    console.log(`Found ${rawCourses.length} courses.`);

    for (let i=0; i<courses.length; i++) {

        const course = courses[i];

        console.log(`Syncing course: ${course.name}`);
        
        await saveCourse(course);
        const rawAssignments = await getAssignmentList(course, auth);
        const assignments = parseAssignments(rawAssignments, course.courseId);

        console.log(`Found ${assignments.length} assignments.`);

        for (const assignment of assignments) {
            await saveAssignment(assignment);
        }
    }
    console.log("Synchronization complete.");
}

