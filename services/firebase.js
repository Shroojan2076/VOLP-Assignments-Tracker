import fs from "fs";
import dotenv from "dotenv";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

dotenv.config();

const serviceAccount = JSON.parse(
    fs.readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT, "utf8")
);

if (getApps().length === 0) {
    initializeApp({
        credential: cert(serviceAccount)
    });
}

const messaging = getMessaging();

export async function sendScheduleNotification(notification) {

    const message = {
        token: process.env.FCM_DEVICE_TOKEN,

        data: {
            action: "SCHEDULE",
            assignmentId: String(notification.assignmentId),
            type: notification.type,
            scheduledFor: String(notification.scheduledFor),
            title: notification.title,
            body: notification.body
        },

        android: {
            priority: "high"
        }
    };

    const response = await messaging.send(message);

    console.log(
        `FCM schedule sent for assignment ${notification.assignmentId} (${notification.type})`
    );

    return response;
}

export async function sendCancelNotification(assignmentId) {

    const message = {
        token: process.env.FCM_DEVICE_TOKEN,

        data: {
            action: "CANCEL",
            assignmentId: String(assignmentId)
        },

        android: {
            priority: "high"
        }
    };

    const response = await messaging.send(message);

    console.log(
        `FCM cancellation sent for assignment ${assignmentId}`
    );

    return response;
}