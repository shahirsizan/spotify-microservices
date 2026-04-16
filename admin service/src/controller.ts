import cloudinary from "cloudinary";
import getBuffer from "./config/dataUri.js";
import { sql } from "./index.js";

interface IUser {
	_id: string;
	name: string;
	email: string;
	role: string;
	playlist: string[];
}

export interface AuthenticatedRequest extends Request {
	user?: IUser | null;
	file?: Express.Multer.File | null;
}

export const addAlbum = async (req: AuthenticatedRequest, res: any) => {
	try {
		if (req.user?.role !== "admin") {
			res.status(401).json({
				message: "❌ You are not admin.",
			});
			return;
		}

		const { title, description }: any = req.body;

		const file = req.file;

		if (!file) {
			res.status(400).json({
				message: "⚠️ No file to upload.",
			});
			return;
		}

		const fileBuffer = getBuffer(file);

		if (!fileBuffer || !fileBuffer.content) {
			res.status(500).json({
				message: "❌ Failed to generate file buffer.",
			});
			return;
		}

		const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
			folder: "albums",
			allowed_formats: ["jpg", "png"],
		});

		// CHANGED!
		// I am storing `cloud.public_id` instead of `cloud.secure_url`
		const result = await sql`
   					INSERT INTO albums (title, description, thumbnail) VALUES (${title}, ${description}, ${cloud.public_id}) RETURNING *
  					`;

		res.status(201).json({
			message: "✅ Album Created",
			album: result[0],
		});
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
	}
};
