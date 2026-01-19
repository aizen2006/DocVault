import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import 'dotenv/config';
import rateLimit from "express-rate-limit";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public', { maxAge: '1d' }));

app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
}));
// routes imports
import userRouter from './routes/user.routes.js';
import recordRouter from './routes/record.routes.js';
import senderRouter from './routes/sender.routes.js';
import receiverRouter from './routes/receiver.routes.js';

//routes declaration
app.use("/api/v1/users/", userRouter)
app.use("/api/v1/records/", recordRouter)
app.use("/api/v1/sender/", senderRouter)
app.use("/api/v1/receiver/", receiverRouter)

// http://localhost:8000/api/v1/users/register

export { app };