import { sync } from './sync.js';
import { getVOLPTime, isVOLPAvailable } from './schedule.js';
import { processNotifications, processCancellations } from '../services/notification.js';

const SYNC_INTERVAL = 4 * 60 * 60 * 1000;

async function runSync() {

    const time = getVOLPTime();

    console.log(
        `Current VOLP time: ${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}`
    );

    if (!isVOLPAvailable()) {
        console.log("VOLP is currently unavailable. Skipping synchronization.");
        return;
    }

    try {

        await sync();

        console.log("Synchronization Successful.");

        await processCancellations();

        await processNotifications();

        console.log("Notification processing complete.");

    } catch (error) {

        console.log("Synchronization Failed: ");
        console.log(error);
    }
}


export async function startScheduler() {
    
    await runSync();   
    setInterval(runSync, SYNC_INTERVAL);
}
