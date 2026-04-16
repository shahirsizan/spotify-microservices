import { type NextFunction, type Request, type Response } from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

interface IUser {
	_id: string;
	name: string;
	email: string;
	role: string;
	playlist: string[];
}

export interface AuthenticatedRequest extends Request {
	user?: IUser | null;
}

export const isAuth = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const token = req.headers.token as string;

		if (!token) {
			res.status(403).json({
				message: "⚠️ No token. Please Login.",
			});
			return;
		}

		// instead of defining the jwt verification manually in this service
		// call User Service api.
		// All the .env variables are set there. No need to define here.
		const { data } = await axios.get(
			`${process.env.User_URL}/api/v1/user/me`,
			{
				headers: {
					token,
				},
			},
		);

		// Append `user object` to the `req object`
		req.user = data;
		next();
	} catch (error) {
		res.status(403).json({
			message: "❌ Error. Please Login.",
		});
	}
};

//multer setup
import multer, { memoryStorage } from "multer";

// const storage = multer.memoryStorage();

const uploadFile = multer({ storage: multer.memoryStorage() }).single("file");

export default uploadFile;
