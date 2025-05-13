import express from "express";
import cors from "cors";
import { config as dotenvConfig } from "dotenv";
import { createRouteHandler } from "uploadthing/express";
import { uploadRouter } from "./uploadthing.js";
import streamTokenRouter from './stream.js';
dotenvConfig();
const app = express();
app.use(cors({
    origin: 'https://fd586825-0d73-4971-99bb-4dfb1e26c3f0-00-slfd6nsxdkqv.picard.replit.dev',
    methods: ['GET', 'POST'],
    credentials: true,
}));
app.use(express.json());
app.use("/api/uploadthing", createRouteHandler({
    router: uploadRouter,
    config: {
        token: process.env.UPLOADTHING_TOKEN,
        isDev: process.env.ENVIRONMENT === "development",
    },
}));
app.use('/api/stream', streamTokenRouter);
const PORT = parseInt(process.env.PORT || '3000');
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
