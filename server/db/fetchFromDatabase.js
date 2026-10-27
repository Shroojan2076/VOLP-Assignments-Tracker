import pool from "./database.js";

export async function fetchAllUsers() {
    const query = `
        SELECT 
            id,
            email,
            password_hash,
            first_name,
            last_name,
            is_active
        FROM users
        WHERE is_active = TRUE
        ORDER BY id ASC;
    `;

    try {
        console.log('Fetching active user portfolios from database...');
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Failed to retrieve users from database:', error.message);
        throw error;
    }
}

export async function fetchUser(userEmail) {
    const query = `
        SELECT 
            id,
            email,
            password_hash,
            first_name,
            last_name,
            is_active
        FROM users
        WHERE email = $1 AND is_active = TRUE;
    `;

    const values = [userEmail];

    try {
        console.log(`Fetching user with email ${userEmail} from database...`);
        const result = await pool.query(query, values);
        return result.rows;
    } catch (error) {
        console.error(`Failed to retrieve user with email ${userEmail} from database:`, error.message);
        throw error;
    }
}

export async function fetchCourses(userId) {
    const query = `
        SELECT 
            id, user_id, course_id, course_offering_learner_id, code, name,
            description, professor, last_seen, progress, active, 
            allow_assessment, archived, created_at, last_synced_at
        FROM courses
        WHERE user_id = $1
        ORDER BY code ASC;
    `;

    try {
        const result = await pool.query(query, [userId]);

        return result.rows.map(item => ({
            id: item.id,
            userId: item.user_id,
            courseId: item.course_id,
            courseOfferingLearnerId: item.course_offering_learner_id,
            code: item.code,
            name: item.name,
            description: item.description,
            professor: item.professor,
            lastSeen: item.last_seen,
            progress: Number(item.progress),
            active: Boolean(item.active),
            allowAssessment: Boolean(item.allow_assessment),
            archived: Boolean(item.archived),
            createdAt: item.created_at,
            lastSyncedAt: item.last_synced_at
        }));
    } catch (error) {
        console.error(`Failed to fetch courses for user_id ${userId}:`, error.message);
        throw error;
    }
}

export async function fetchAssignments(userId, courseId = null) {
    let query = `
        SELECT 
            id, user_id, assignment_id, course_id, marks, submitted, question,
            due_date, grace_date, graded, evaluated, score, 
            submission_file, submission_path, created_at, last_synced_at
        FROM assignments
        WHERE user_id = $1
    `;

    const values = [userId];

    if (courseId !== null) {
        values.push(courseId);
        query += ` AND course_id = $2`;
    }

    query += ` ORDER BY due_date ASC;`;

    try {
        const result = await pool.query(query, values);

        return result.rows.map(item => ({
            id: item.id,
            userId: item.user_id,
            assignmentId: item.assignment_id,
            courseId: item.course_id,
            marks: item.marks ? Number(item.marks) : null,
            submitted: Boolean(item.submitted),
            question: item.question,
            dueDate: item.due_date,
            graceDate: item.grace_date,
            graded: Boolean(item.graded),
            evaluated: Boolean(item.evaluated),
            score: item.score ? Number(item.score) : null,
            submissionFile: item.submission_file,
            submissionPath: item.submission_path,
            createdAt: item.created_at,
            lastSyncedAt: item.last_synced_at
        }));
    } catch (error) {
        console.error(`Failed to fetch assignments for user_id ${userId}:`, error.message);
        throw error;
    }

}

export async function fetchUpcomingDeadlines(daysAhead = 3) {
    const query = `
        SELECT 
            u.id AS user_id,
            u.email AS user_email,
            u.first_name,
            u.last_name,
            c.code AS course_code,
            c.name AS course_name,
            a.assignment_id,
            a.question,
            a.marks,
            a.due_date,
            a.grace_date
        FROM assignments a
        JOIN courses c ON a.course_id = c.course_id AND a.user_id = c.user_id
        JOIN users u ON a.user_id = u.id
        WHERE u.is_active = TRUE
          AND a.submitted = FALSE
          AND a.due_date >= CURRENT_TIMESTAMP
          AND a.due_date <= (CURRENT_TIMESTAMP + ($1 * INTERVAL '1 day'))
        ORDER BY u.id ASC, a.due_date ASC;
    `;

    try {
        const result = await pool.query(query, [daysAhead]);
        return result.rows;
    } catch (err) {
        console.error(`Failed to fetch upcoming deadlines`, err.message);
        throw err;
    }
}