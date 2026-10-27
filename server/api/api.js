import axios from "axios";
import { config } from "dotenv";

config();

// const email = process.env.VOLP_EMAIL;
// const password = process.env.VOLP_PASSWORD;

export async function login(email, password) {
    const loginResponse = await axios.post(
        "https://admin.volp.in/login/process",
        {
            username: email,
            pwd: password,
        },
        {
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json;charset=UTF-8",
                "Device": "Web",
                "Organization-Code": "null",
                "Origin": "https://classroom.volp.in",
                "Referer": "https://classroom.volp.in/",
                "Router-Path": "/login"
            }
        });
        
        console.log("Login Status: ", loginResponse.status);

        const { token, uid, ut, flag } = loginResponse.data || {};

        if ((!token || !uid || !ut || flag === "NO")) {
            console.log("Invalid college email or password");
            return  { token, uid, ut, status: 401 };
        }

        return  { token, uid, ut, status: 200 };
}

export async function getCourses(auth) {
    const coursesResponse = await axios.post(
        "https://learner.volp.in/learnerCourseDashboard/learnerCourseList",
        null,
        {
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Device": "Web",
                "Organization-Code": "null",
                "Origin": "https://classroom.volp.in",
                "Referer": "https://classroom.volp.in/",
                "Router-Path": "/learner/my-courses",
                "token": auth.token,
                "uid": auth.uid,
                "ut": auth.ut
            }
        }); 

        console.log("Courses Fetch Status: ", coursesResponse.status);
        const data = coursesResponse.data.col_list;

        return data;
}

export async function getAssignments(course, auth) {
    const response = await axios.post(
        "https://learner.volp.in/SubjectiveAssignment/getSubjectiveAssignment_new",
        {
            course_offering_learner_id: course.courseOfferingLearnerId,
            courseId: course.courseId,
            type: "content",
        },
        {
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json;charset=UTF-8",
                "Device": "Web",
                "Organization-Code": "null",
                "Origin": "https://classroom.volp.in",
                "Referer": "https://classroom.volp.in/",
                "Router-Path": "/learner-subjective-assignment",
                "token": auth.token,
                "uid": auth.uid,
                "ut": auth.ut,
            }
        }
    )
    console.log("Assignment Fetch Status: ", response.status);
    const data = response.data.question_list;

    return data;
}


// const auth = await login(email, password);
// const courses = await getCourses(auth);



// console.log(auth)
// console.log(courses)