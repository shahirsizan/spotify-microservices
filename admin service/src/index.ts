import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import adminRoutes from "./route.js";
import cloudinary, { type ConfigOptions } from "cloudinary";
import cors from "cors";
import { neon } from "@neondatabase/serverless";
import { connectRedis } from "./config/redis.js";
dotenv.config();

const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(express.json());

cloudinary.v2.config({
	cloud_name: process.env.Cloudinary_Cloud_Name as string,
	api_key: process.env.Cloudinary_Api_Key as string,
	api_secret: process.env.Cloudinary_Api_Secret as string,
});

export const sql = neon(process.env.DB_URL as string);

app.use("/api/v1", adminRoutes);

app.listen(port, async () => {
	try {
		await initDB(sql);
		await connectRedis();
		console.log(`✅ Admin service running on port ${port}`);
	} catch (error: any) {
		console.error(error.message);
	}
});
