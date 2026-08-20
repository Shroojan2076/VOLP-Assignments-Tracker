import { db } from "./database.js";

export async function notificationSent(assignmentId, notificationType) {
    const query = `
        SELECT id
        FROM notifications
        WHERE assignment_id = ?
        AND notification_type = ?
        LIMIT 1
    `;

    const [rows] = await db.execute(query, [assignmentId, notificationType]);

    return rows.length > 0;
    
}

export async function recordNotification (assignmentId, notificationType) {

    const query = `
        INSERT INTO  notifications (
        assignment_id,
        notification_type
        )
        VALUES (?,  ?)
        ON DUPLICATE KEY UPDATE
            assignment_id = assignment_id
    `;

    const [result] = await db.execute(query, [assignmentId, notificationType]);

    console.log('Data logged.')

    return result;
}