import { getDeadlineInfo } from "./deadline.js";
import { notificationSent, recordNotification } from "../db/notifications.js";
import { db } from "../db/database.js";
import { sendCancelNotification, sendScheduleNotification } from "./firebase.js";

const IMP_STATUS = new Set([
    'URGENT',
    'APPROACHING',
    'CRITICAL'
]);

export async function getPendingNotifications() {
   
    const assignments = await getDeadlineInfo();

    const pending = [];

    for(let i=0; i<assignments.length; i++) {
        const assignment = assignments[i];
        
        if (!IMP_STATUS.has(assignment.status)) continue;

        const alreadySent = await notificationSent(assignment.assignmentId, assignment.status)

        if (alreadySent) continue;

        pending.push({
            assignmentId: assignment.assignmentId,
            courseId: assignment.courseId,
            status: assignment.status,
            dueDate: assignment.dueDate,
            timeRemaining: assignment.timeRemaining,
            question: assignment.question
        });
    }

    return pending;    
}

export async function getPendingCancellations() {

    const query = `
        SELECT DISTINCT a.assignment_id
        FROM assignments a
        INNER JOIN notifications n
            ON a.assignment_id = n.assignment_id
        WHERE a.submitted = 1
            AND NOT EXISTS (
                SELECT 1
                FROM notifications c
                WHERE c.assignment_id = a.assignment_id
                    AND c.notification_type = 'CANCELLED'
            )
    `;

    const [rows] = await db.execute(query);

    return rows.map(row => row.assignment_id);
}

export async function processNotifications() {

    const pending = await getPendingNotifications();

    for (const notification of pending) {

        console.log(
            `Sending ${notification.status} notification for assignment ${notification.assignmentId}`
        );

        try {

            const scheduledFor = getScheduledTime(notification);

            if (scheduledFor <= Date.now()) {
                console.log(
                    `Skipping ${notification.status} notification for assignment ${notification.assignmentId} because its scheduled time has passed.`
                );
                continue;
            }

            await sendScheduleNotification({
                assignmentId: notification.assignmentId,
                type: notification.status,
                scheduledFor: scheduledFor,
                title: getNotificationTitle(notification),
                body: getNotificationBody(notification)
            });

            await recordNotification(
                notification.assignmentId,
                notification.status
            );

            console.log(
                `Notification recorded for assignment ${notification.assignmentId}`
            );

        } catch (error) {

            console.error(
                `Failed to send notification for assignment ${notification.assignmentId}:`,
                error
            );
        }
    }

    return pending.length;
}

export async function processCancellations() {

    const assignments = await getPendingCancellations();

    for (const assignmentId of assignments) {

        console.log(
            `Sending CANCEL notification for assignment ${assignmentId}`
        );

        try {

            await sendCancelNotification(assignmentId);

            await recordNotification(
                assignmentId,
                'CANCELLED'
            );

            console.log(
                `Cancellation recorded for assignment ${assignmentId}`
            );

        } catch (error) {

            console.error(
                `Failed to cancel notifications for assignment ${assignmentId}:`,
                error
            );
        }
    }

    return assignments.length;
}

function getScheduledTime(notification) {

    const dueTime = new Date(notification.dueDate).getTime();

    switch (notification.status) {

        case "APPROACHING":
            // Starts when 3 days remain
            return dueTime - (3 * 24 * 60 * 60 * 1000);

        case "URGENT":
            // Starts when 24 hours remain
            return dueTime - (24 * 60 * 60 * 1000);

        case "CRITICAL":
            // Starts when 6 hours remain
            return dueTime - (6 * 60 * 60 * 1000);

        case "OVERDUE":
            // Deadline has already passed
            return dueTime;

        default:
            throw new Error(
                `Unsupported notification status: ${notification.status}`
            );
    }
}

function getNotificationTitle(notification) {

    switch (notification.status) {

        case "APPROACHING":
            return "Assignment approaching";

        case "URGENT":
            return "Assignment due within 24 hours";

        case "CRITICAL":
            return "Assignment due soon";

        case "OVERDUE":
            return "Assignment overdue";

        default:
            return "VOLP Assignment";
    }
}

function getNotificationBody(notification) {

    if (notification.status === "OVERDUE") {
        return `Assignment ${notification.assignmentId} is overdue.`;
    }

    if (!notification.dueDate) {
        return `Assignment ${notification.assignmentId} has no deadline.`;
    }

    return `Assignment ${notification.assignmentId} is due on ${
        new Date(notification.dueDate).toLocaleString()
    }.`;
}