import { createClient } from "redis";

// Use `localhost` because my app is local, but Redis PORT is mapped to my machine
export const redisClient = createClient({
	url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => console.log("❌ Redis Client Error: ", err));

export const connectRedis = async () => {
	// In a development environment with "Hot Reloading" (like nodemon),
	// the index.ts might re-run frequently. If connect() is called on a client
	// that is already connected, it will throw an error.
	if (redisClient.isOpen) {
		return;
	}

	try {
		await redisClient.connect();
		// Explicitly ask Redis if it is alive
		const pingResponse = await redisClient.ping();
		if (pingResponse === "PONG") {
			console.log("✅ Connected & Pinged Redis Stack successfully");
		}
	} catch (error: any) {
		console.error("❌ Could not connect to Redis: ", error.message);
		throw error;
	}
};
