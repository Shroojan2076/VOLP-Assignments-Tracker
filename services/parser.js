import { parseVOLPDateTime } from './date.js';
import { login } from '../API/api.js';
import { getCourses } from '../API/api.js';
import { getAssignmentList } from '../API/api.js';

export function parseAssignments(assignments, crsId) {
    const data = assignments.map(item => ({
        assignmentId: item.ass_id,
        courseId: crsId,
        marks: Number(item.weightage),
        submitted: item.issubmitted,
        question: item.question,
        dueDate: parseVOLPDateTime(item.due_date),
        graceDate: parseVOLPDateTime(item.grace_date),
        graded: item.graded,
        evaluated: item.isevaluated,
        score: item.obtained_marks ?? null,
        submissionFile: item.submitted_answer_file_name ?? null,
        submissionPath: item.submitted_answer_file_path ?? null,
    }));
    
    return data;
}

export function parseCourses(courses) {
    const data = courses.map(item => ({
        courseId: item.crsid,
        courseOfferingLearnerId: item.colid,
        code: item.code,
        name: item.course?.course_name ?? item.code,
        description: item.description,
        professor: item.inst,
        lastSeen: item.lastseen,
        progress: Number(item.progress),
        active: Boolean(item.course_status),
        allowAssessment: Boolean(item.allow_assessment),
        archived: Boolean(item.is_archived)
        }));

    return data;
}


// const auth = await login();
// const resp = await getCourses(auth);
// const rawAssignments = await getAssignmentList(resp[0], auth);

// const assignments = parseAssignments(rawAssignments, 15917);

// console.log(assignments[0]);

// console.log(assignments[0].dueDate instanceof Date);
// console.log(assignments[0].dueDate.toString());