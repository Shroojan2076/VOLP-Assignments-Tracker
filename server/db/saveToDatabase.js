import pool from "./database.js";

export async function saveCourse(course) {
    const query = `
        INSERT INTO courses (
            user_id,
            course_id,
            course_offering_learner_id,
            code,
            name,
            description,
            professor,
            last_seen,
            progress,
            active,
            allow_assessment,
            archived,
            last_synced_at
        )
        VALUES (
            $1, $2, $3, $4, $5, $6,
            $7, $8, $9, $10, $11, $12,
            CURRENT_TIMESTAMP
        )
        ON CONFLICT (user_id, course_id)
        DO UPDATE SET
            course_offering_learner_id = EXCLUDED.course_offering_learner_id,
            code = EXCLUDED.code,
            name = EXCLUDED.name,
            description = EXCLUDED.description,
            professor = EXCLUDED.professor,
            last_seen = EXCLUDED.last_seen,
            progress = EXCLUDED.progress,
            active = EXCLUDED.active,
            allow_assessment = EXCLUDED.allow_assessment,
            archived = EXCLUDED.archived,
            last_synced_at = CURRENT_TIMESTAMP
        RETURNING id;
    `;

    const values = [
        course.userId,
        course.courseId,
        course.courseOfferingLearnerId,
        course.code,
        course.name,
        course.description,
        course.professor,
        course.lastSeen ? new Date(course.lastSeen) : null, 
        course.progress,
        course.active,
        course.allowAssessment,
        course.archived
    ];

    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error(`Failed to upsert course_id ${course.courseId} for user_id ${course.userId}:`, error.message);
        throw error;
    }
}

export async function saveAssignment(assignment) {
    const query = `
        INSERT INTO assignments (
            user_id,
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
            submission_path,
            last_synced_at
        )
        VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
            CURRENT_TIMESTAMP
        )
        ON CONFLICT (user_id, assignment_id)
        DO UPDATE SET
            course_id = EXCLUDED.course_id,
            marks = EXCLUDED.marks,
            submitted = EXCLUDED.submitted,
            question = EXCLUDED.question,
            due_date = EXCLUDED.due_date,
            grace_date = EXCLUDED.grace_date,
            graded = EXCLUDED.graded,
            evaluated = EXCLUDED.evaluated,
            score = EXCLUDED.score,
            submission_file = EXCLUDED.submission_file,
            submission_path = EXCLUDED.submission_path,
            last_synced_at = CURRENT_TIMESTAMP
        RETURNING id, (xmax = 0) AS is_new_assignment;
    `;

    const values = [
        assignment.userId,
        assignment.assignmentId,
        assignment.courseId,
        assignment.marks,
        assignment.submitted,
        assignment.question,
        assignment.dueDate ? new Date(assignment.dueDate) : null,
        assignment.graceDate ? new Date(assignment.graceDate) : null,
        assignment.graded,
        assignment.evaluated,
        assignment.score,
        assignment.submissionFile,
        assignment.submissionPath
    ];

    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error(`Failed to upsert assignment_id ${assignment.assignmentId} for user_id ${assignment.userId}:`, error.message);
        throw error;
    }
}

export async function saveUser(user) {
    const query = `
        INSERT INTO users (
            email,
            password_hash,
            first_name,
            last_name,
            is_active,
            updated_at
        )
        VALUES (
            $1, $2, $3, $4, $5, CURRENT_TIMESTAMP
        )
        ON CONFLICT (email)
        DO UPDATE SET
            password_hash = EXCLUDED.password_hash,
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            is_active = EXCLUDED.is_active,
            updated_at = CURRENT_TIMESTAMP
        RETURNING id, email, created_at;
    `;

    const values = [
        user.email,
        user.password, 
        user.firstName,
        user.lastName,
        user.isActive !== undefined ? user.isActive : true // Fallback default state
    ];

    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error(`Failed to save user with email ${user.email}:`, error.message);
        throw error;
    }
}