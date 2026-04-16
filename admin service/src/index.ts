import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import cors from "cors";
import { neon } from "@neondatabase/serverless";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT;

export const sql = neon(process.env.DB_URL as string);

app.listen(port, async () => {
	console.log(`✅ Admin service running on port ${port}`);
	await initDB(sql);
});
