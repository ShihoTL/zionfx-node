import express, { Request, Response, NextFunction } from "express";
import { StreamClient } from "@stream-io/node-sdk";
import { config as dotenvConfig } from "dotenv";

const router = express.Router();

dotenvConfig();

const STREAM_API_KEY = process.env.STREAM_API_KEY!;
const STREAM_API_SECRET = process.env.STREAM_API_SECRET!;

// Define the expected request body type
interface TokenRequestBody {
  userId: string;
}

// Define the token route with proper typing
router.post(
  "/token",
  async (
    req: Request<{}, {}, TokenRequestBody>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    console.log('Received token request:', req.body);
    try {
      const { userId } = req.body;

      if (!userId) {
        res.status(400).json({ error: "Missing userId" });
        return;
      }

      const expirationTime = Math.floor(Date.now() / 1000) + 3600;
      const issuedAt = Math.floor(Date.now() / 1000) - 60;

      const client = new StreamClient(STREAM_API_KEY, STREAM_API_SECRET);
      const token = client.createToken(userId, expirationTime, issuedAt);

      res.json({ token });
    } catch (err) {
      console.error('Error in token route:', err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default router;