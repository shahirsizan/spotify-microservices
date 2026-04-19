import { createClient } from "redis";

// Use `localhost` because my app is local, but Redis PORT is mapped to my machine
export const redisClient = createClient({
	url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => console.log("❌ Redis Client Error: ", err));

export const connectRedis = async () => {
	try {
		await redisClient.connect();
		console.log("✅ Connected to Redis Stack (Port 6379)");
	} catch (error) {
		console.error("❌ Could not connect to Redis: ");
		throw error;
	}
};
