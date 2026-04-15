import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "./model.js";

export const registerUser = async (req: any, res: any) => {
	try {
		const { name, email, password } = req.body;
		let user = await User.findOne({ email });

		if (user) {
			res.status(400).json({
				message: "⚠️ User Already exists",
			});

			return;
		}

		const hashPassword = await bcrypt.hash(password, 10);

		user = await User.create({
			name,
			email,
			password: hashPassword,
		});

		// create jst token for the `user._id`
		const token = jwt.sign(
			{ _id: user._id },
			process.env.JWT_SEC as string,
			{
				expiresIn: "3d",
			},
		);

		res.status(201).json({
			message: "✅ User Registered",
			user,
			token,
		});

		// {"message":"✅ User Registered",
		// "user":{"name":"abc",
		// 		"email":"abc@gmail.com",
		// 		"password":"$2b$10$cNeShLoaKjGAzMS9iAMn6eAnKPgBDXKEXONOwjfiPCdXuKAs2KBMe",
		// 		"role":"user",
		// 		"playlist":[],
		// 		"_id":"69df738c24941cedf8c1b63e",
		// 		"createdAt":"2026-04-15T11:16:28.745Z",
		// 		"updatedAt":"2026-04-15T11:16:28.745Z",
		// 		"__v":0},
		// 		"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OWRmNzM4YzI0OTQxY2VkZjhjMWI2M2UiLCJpYXQiOjE3NzYyNTE3ODgsImV4cCI6MTc3NjUxMDk4OH0.mLGeUJckb5xsghbD_mCcTIDrgLWhvWgdRgmeFA3NtSc"}
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
	}
};

export const loginUser = async (req: any, res: any) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });

	if (!user) {
		res.status(404).json({
			message: "❌ User doesn't exist",
		});
		return;
	}

	const passwordMatches = await bcrypt.compare(password, user.password);

	if (!passwordMatches) {
		res.status(400).json({
			message: "❌ Invalid Password",
		});
		return;
	}

	const token = jwt.sign({ _id: user._id }, process.env.JWT_SEC as string, {
		expiresIn: "3d",
	});

	res.status(200).json({
		message: "✅ Logged in successfully",
		user,
		token,
	});
};
