const NOTIFICATION_OFFSETS = {
    'APPROACHING': 3 * 24 * 60 * 60 * 1000,
    'URGENT': 24 * 60 * 60 * 1000,
    'CRITICAL': 6 * 60 * 60 * 1000
}

export function getNotificationSchedule(assignment, now = new Date()) {
    if (!assignment.dueDate) return [];
    if (assignment.submitted) return [];

    const dueDate =  new Date(assignment.dueDate);

    const notifications = [];

    for  (const [type, offset] of Object.entries(NOTIFICATION_OFFSETS)) {
        const scheduledFor = new Date(dueDate.getTime() - offset);

        if (scheduledFor > now) {
            notifications.push({
                assignmentId: assignment.assignmentId,
                type,
                scheduledFor
            });
        }
    }
    return notifications;
}