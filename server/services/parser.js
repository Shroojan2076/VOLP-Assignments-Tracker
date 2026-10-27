import { parseVOLPDateTime } from './date.js';

export function parseAssignments(assignments, crsId, userId) {
    const data = assignments.map(item => ({
        userId: userId,
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

    console.log(`Found ${data.length} assignments.`);
    
    return data;
}

export function parseCourses(courses, userId) {
    const data = courses.map(item => ({
        userId: userId,
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

    console.log(`Found ${data.length} courses.`);
    
    return data;
}

export function parseUsers(users) {
    const data = users.map(item => ({
        id: item.id,
        email: item.email,
        password: item.password_hash,
        firstName: item.first_name ?? null, 
        lastName: item.last_name ?? null,  
        isActive: Boolean(item.is_active),
        createdAt: item.created_at,
        updatedAt: item.updated_at
    }));

    console.log(`Found ${data.length} users.`);

    return data;
}

// const auth = await login();
// const resp = await getCourses(auth);
// const rawAssignments = await getAssignmentList(resp[0], auth);

// const assignments = parseAssignments(rawAssignments, 15917);

// console.log(assignments[0]);

// console.log(assignments[0].dueDate instanceof Date);
// console.log(assignments[0].dueDate.toString());