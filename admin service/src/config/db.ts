import dotenv from "dotenv";

dotenv.config();

export const initDB = async (sql: any) => {
	// const sql = neon(process.env.DB_URL as string);
	try {
		await sql`
        CREATE TABLE IF NOT EXISTS albums(
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description VARCHAR(255) NOT NULL,
          thumbnail VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `;

		await sql`
        CREATE TABLE IF NOT EXISTS songs(
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description VARCHAR(255) NOT NULL,
          thumbnail VARCHAR(255),
          audio VARCHAR(255) NOT NULL,
          album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `;

		console.log("✅ NeonDB initialized successfully");
	} catch (error) {
		console.log("❌ Error initDb: ", error);
	}
};
