import axios from 'axios';
import dotenv from 'dotenv';
import { parseCourses } from '../services/parser.js';

dotenv.config();

const username = process.env.VOLP_EMAIL;
const password = process.env.VOLP_PASSWORD;

export async function login() {
    const data = {};
    const response = await axios.post(
        "https://admin.volp.in/login/process",
        {
            username: username,
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
        
        console.log("Login Status: ", response.status);
        
        data.token = response.data.token;
        data.uid = response.data.uid;
        data.ut = response.data.ut;

        return data;
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

export async function getAssignmentList(course, auth) {
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

// const auth = await login();
// if (auth) {
//     const rawResp = await getCourses(auth);
//     const resp = parseCourses(rawResp);
//     if (resp) {
//         console.log(resp[0])
//         const data1 = await getAssignmentList(resp[0], auth);
//         console.log(data1);
//         const data2 = await getAssignmentList(resp[1], auth);
//         console.log(data2);
//         const data3 = await getAssignmentList(resp[2], auth);
//         console.log(data3);
//         const data4 = await getAssignmentList(resp[3], auth);
//         console.log(data4);
//     }
// }




