import express from 'express';
import dotenv from 'dotenv';
import { authenticate } from './middleware/auth.js';
import { startScheduler } from '../sync/scheduler.js';
import assignRoute from './routes/assignments.js';
import courseRoute from './routes/courses.js';
import notificationRoute from './routes/notifications.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())

app.get("/api/health", (req, res) => {
    res.json({
        status: 'ok'
    });
})

app.use("/api/assignments", authenticate, assignRoute);

app.use("/api/courses", authenticate, courseRoute);

app.use("/api/notifications", authenticate, notificationRoute);

app.listen(port, () => {
    console.log(`Server is running at port ${port}.`);
    startScheduler();
})
