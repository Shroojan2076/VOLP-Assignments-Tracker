import { getUpcomingAssignments, getOverdueAssignments } from "../db/assignments.js";

export async function getDeadlineInfo() {

    
    const upcoming = await getUpcomingAssignments();
    const overdue = await getOverdueAssignments();
    
    const assignments = [...upcoming, ...overdue];
    
    return assignments.map(assignment => ({
        ...assignment,
        status: getDeadlineStatus(assignment),
        timeRemaining: 
            assignment.dueDate === null 
            ? null 
            : assignment.dueDate.getTime() - Date.now(),
    }));
}

export function getDeadlineStatus (assignment, now = new Date()) {
    if (assignment.dueDate === null) {
        return 'NO_DEADLINE';
    }

    const timeRemaining = assignment.dueDate.getTime() - now.getTime();

    const hoursRemaining = timeRemaining / (1000 * 60 * 60);

    if (hoursRemaining <= 0) {
        return 'OVERDUE'
    }

    if (hoursRemaining <= 6) {
        return 'CRITICAL';
    }

    if (hoursRemaining <= 24) {
        return 'URGENT';
    }

    if (hoursRemaining <= 72) {
        return 'APPROACHING';
    }

    return 'UPCOMING';



}