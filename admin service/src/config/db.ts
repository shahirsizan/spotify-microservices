import type {
	NeonQueryFunction,
	NeonQueryFunctionInTransaction,
} from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

export const initDB = async (sql: NeonQueryFunction<any, any>) => {
	try {
		// We wrap the operations in a transaction block
		await sql.transaction((tx) => {
			return [
				tx`
        CREATE TABLE IF NOT EXISTS albums(
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description VARCHAR(255) NOT NULL,
          thumbnail VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

				tx`CREATE TABLE IF NOT EXISTS songs(
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description VARCHAR(255) NOT NULL,
          thumbnail VARCHAR(255),
          audio VARCHAR(255) NOT NULL,
          album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
			];
		});

		console.log("✅ NeonDB initialized successfully");
	} catch (error: any) {
		console.log("❌ Error initDb: ");
		throw error;
	}
};
