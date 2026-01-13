import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import 'dotenv/config';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(express.json({limit:'10kb'}));
app.use(express.urlencoded({ extended: true , limit:'16kb' }));
app.use(express.static('public',{ maxAge: '1d' }));

app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
}));
// routes imports



//routes declaration


export { app };