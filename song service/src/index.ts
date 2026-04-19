import express from "express";
import doetnv from "dotenv";
import { neon } from "@neondatabase/serverless";
import songRoutes from "./route.js";
import { connectRedis } from "./config/redis.js";
import cors from "cors";

doetnv.config();
const port = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());

export const sql = neon(process.env.DB_URL as string);

app.use("/api/v1", songRoutes);

app.listen(port, async () => {
	try {
		console.log(`✅ Song service running on port ${port}`);
		if (sql != undefined) {
			console.log("✅ Connected to NeonDB");
		}
		await connectRedis();
	} catch (error: any) {
		console.log("❌ Error in index.js: ", error.message);
	}
});
