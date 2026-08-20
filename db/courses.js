import { db } from "./database.js";

export async function saveCourse(course) {
    const query = `
        INSERT INTO courses (
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
            archived
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            course_offering_learner_id = VALUES(course_offering_learner_id),
            code = VALUES(code),
            name = VALUES(name),
            description = VALUES(description),
            professor = VALUES(professor),
            last_seen = VALUES(last_seen),
            progress = VALUES(progress),
            active = VALUES(active),
            allow_assessment = VALUES(allow_assessment),
            archived = VALUES(archived),
            last_synced_at = CURRENT_TIMESTAMP
    `;

    const values = [
        course.courseId,
        course.courseOfferingLearnerId,
        course.code,
        course.name,
        course.description,
        course.professor,
        course.lastSeen,
        course.progress,
        course.active,
        course.allowAssessment,
        course.archived
    ];

    const [result] = await db.execute(query, values);

    return result;
}

export async function getCourseList(params) {
    const query = `
        SELECT *
        FROM courses
        ORDER BY name ASC
    `;

    const [rows] = await db.execute(query);

    return rows.map(row => ({
        courseId: row.course_id,
        courseOfferingLearnerId: row.course_offering_learner_id,
        code: row.code,
        name: row.name,
        description: row.description,
        professor: row.professor,
        lastSeen: row.last_seen,
        progress: Number(row.progress),
        active: Boolean(row.active),
        allowAssessment: Boolean(row.allow_assessment),
        archived: Boolean(row.archived)
    }))
}