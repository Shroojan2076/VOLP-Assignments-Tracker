import express from "express";
import reSyncRouter from "./routes/resync.js";
import authRouter from "./routes/auth.js";
import fetchRouter from "./routes/fetch.js";
import NotifyRouter from "./routes/notify.js";
import { config } from "dotenv";
import cors from "cors";

config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "online",
        host: req.get("host") || "localhost",
        timestamp: new Date().toISOString()
    });
});

app.use("/api/resync", reSyncRouter);
app.use("/api/auth", authRouter);
app.use("/api/fetch", fetchRouter);
app.use("/api/notify", NotifyRouter);


app.listen(port, () => {
    console.log(
        `Server is running at port ${port}.`
    );

    console.log(
        `Web app available at http://localhost:${port}.`
    );
})