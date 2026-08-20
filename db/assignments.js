import { db } from "./database.js";

export async function saveAssignment(assignment) {

    const query = `
        INSERT INTO assignments (
            assignment_id,
            course_id,
            marks,
            submitted,
            question,
            due_date,
            grace_date,
            graded,
            evaluated,
            score,
            submission_file,
            submission_path
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

        ON DUPLICATE KEY UPDATE
            course_id = VALUES(course_id),
            marks = VALUES(marks),
            submitted = VALUES(submitted),
            question = VALUES(question),
            due_date = VALUES(due_date),
            grace_date = VALUES(grace_date),
            graded = VALUES(graded),
            evaluated = VALUES(evaluated),
            score = VALUES(score),
            submission_file = VALUES(submission_file),
            submission_path = VALUES(submission_path),
            last_synced_at = CURRENT_TIMESTAMP
    `;

    const values = [
        assignment.assignmentId,
        assignment.courseId,
        assignment.marks,
        assignment.submitted,
        assignment.question,
        assignment.dueDate,
        assignment.graceDate,
        assignment.graded,
        assignment.evaluated,
        assignment.score,
        assignment.submissionFile,
        assignment.submissionPath
    ];

    const [result] = await db.execute(query, values);

    return result;
}

export async function getUpcomingAssignments(params) {
    const query = `
        SELECT * FROM assignments
        WHERE submitted = 0
            AND (
            due_date > NOW()
            OR due_date IS NULL
            )
        ORDER BY due_date ASC
    `;
    const [rows] = await db.execute(query);

    const data = rows.map(row => ({
        assignmentId: row.assignment_id,
        courseId: row.course_id,
        marks: Number(row.marks),
        submitted: Boolean(row.submitted),
        question: row.question,
        dueDate: row.due_date,
        graceDate: row.grace_date,
        graded: Boolean(row.graded),
        evaluated: Boolean(row.evaluated),
        score: row.score,
        submissionFile: row.submission_file,
        submissionPath: row.submission_path
    }))
    return data;
}

export async function getOverdueAssignments(params) {
    const query = `
        SELECT * FROM assignments
        WHERE submitted = 0
            AND due_date <= NOW()
        ORDER BY due_date ASC
    `;
    const [rows] = await db.execute(query);
    
    const data = rows.map(row => ({
        assignmentId: row.assignment_id,
        courseId: row.course_id,
        marks: Number(row.marks),
        submitted: Boolean(row.submitted),
        question: row.question,
        dueDate: row.due_date,
        graceDate: row.grace_date,
        graded: Boolean(row.graded),
        evaluated: Boolean(row.evaluated),
        score: row.score,
        submissionFile: row.submission_file,
        submissionPath: row.submission_path
    }))
    return data;  
}