import { type NextFunction, type Request, type Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { type IUser, User } from "./model.js";

type userProperty = Omit<IUser, "password">;
// `req` object may or may not contain extra `user` property at the end of the middleware.
// So append `user` type to the base `Request` type.
export interface AuthenticatedRequest extends Request {
	user?: userProperty | null;
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
				message: "⚠️ No token. Please Login",
			});
			return;
		}

		const decodedValue = jwt.verify(
			token,
			process.env.JWT_SEC as string,
		) as JwtPayload;

		if (!decodedValue || !decodedValue._id) {
			res.status(403).json({
				message: "❌ Invalid token. Please Login",
			});
			return;
		}

		const userId = decodedValue._id;
		const user = await User.findById(userId).select("-password");

		if (!user) {
			res.status(403).json({
				message: "❌ User Not found. Please Login",
			});

			return;
		}

		// Append `user` object to `request` and delegate to next controller
		req.user = user;

		next();
	} catch (error) {
		res.status(403).json({
			message: "❌ Error. Please login",
		});
	}
};
