export function parseVOLPDateTime(datetime) {
    if (!datetime) return null;

    const parts = datetime.trim().split(/\s+/);

    if (parts.length !== 3) {
        throw new Error(`Invalid VOLP date format: ${datetime}`);
    }

    const [date, time, period] = parts;

    const [day, month, year] = date.split("/").map(Number);
    let [hours, minutes] = time.split(":").map(Number);

    if (
        !Number.isInteger(day) ||
        !Number.isInteger(month) ||
        !Number.isInteger(year) ||
        !Number.isInteger(hours) ||
        !Number.isInteger(minutes)
    ) {
        throw new Error(`Invalid VOLP date: ${datetime}`);
    }

    if (hours >= 0 && hours <= 23) {
    } else if (period === "AM") {
        if (hours === 12) {
            hours = 0;
    }
    } else if (period === "PM") {
        if (hours !== 12) {
            hours += 12;
        }
    } else {
        throw new Error(`Invalid AM/PM value: ${period}`);
    }

    const new_date = new Date(
        year, 
        month-1,
        day,
        hours,
        minutes,
        0,
        0
    )

    if (
        new_date.getFullYear() !== year ||
        new_date.getMonth() !== month - 1 ||
        new_date.getDate() !== day ||
        new_date.getHours() !== hours ||
        new_date.getMinutes() !== minutes
    ) {
        throw new Error(`Invalid date: ${datetime}`);
    }

    return new_date;
}

