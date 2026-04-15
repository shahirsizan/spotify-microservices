import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./route.js";
import cors from "cors";

dotenv.config();

const connectDb = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI as string, {
			dbName: "Spotify",
		});

		console.log("✅ MongoDB (Docker Container) Connected");
	} catch (error) {
		console.log(error);
	}
};

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/v1", userRoutes);

app.get("/", (req, res) => {
	res.send("<h1>Server is working</h1>");
});

const port = process.env.PORT || 5000;

app.listen(5000, () => {
	console.log(`✅ Server running on: ${port}`);
	connectDb();
});
