import express from "express";
import doetnv from "dotenv";
import { neon } from "@neondatabase/serverless";
import songRoutes from "./route.js";
import cors from "cors";

doetnv.config();

const app = express();
app.use(cors());
app.use(express.json());

export const sql = neon(process.env.DB_URL as string);

app.use("/api/v1", songRoutes);

const port = process.env.PORT;

app.listen(port, async () => {
	console.log(`✅ Song service running on port ${port}`);
});
