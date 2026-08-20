const VOLP_TIME_ZONE = "Asia/Kolkata";

const SHUTDOWN_START = 23 * 60 + 30; // 23:30
const STARTUP_TIME = 6 * 60;         // 06:00


export function getVOLPTime() {

    const now = new Date();

    const parts = new Intl.DateTimeFormat("en-IN", {
        timeZone: VOLP_TIME_ZONE,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    }).formatToParts(now);

    const hour = Number(
        parts.find(part => part.type === "hour").value
    );

    const minute = Number(
        parts.find(part => part.type === "minute").value
    );

    return {
        hour,
        minute,
        totalMinutes: hour * 60 + minute
    };
}


export function isVOLPAvailable() {

    const { totalMinutes } = getVOLPTime();

    return (
        totalMinutes >= STARTUP_TIME &&
        totalMinutes < SHUTDOWN_START
    );
}

export function isVOLPAvailableAt(hour, minute) {

    const totalMinutes = hour * 60 + minute;

    return (
        totalMinutes >= STARTUP_TIME &&
        totalMinutes < SHUTDOWN_START
    );
}