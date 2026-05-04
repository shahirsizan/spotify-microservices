import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "./model.js";
import { type AuthenticatedRequest } from "./middleware.js";

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
				expiresIn: "1d",
			},
		);

		const userObj = user.toObject();
		delete userObj.password;

		res.status(201).json({
			message: "✅ User Registered",
			userObj,
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

	const passwordMatches = await bcrypt.compare(
		password,
		user.password as string,
	);

	if (!passwordMatches) {
		res.status(400).json({
			message: "❌ Invalid Password",
		});
		return;
	}

	const token = jwt.sign({ _id: user._id }, process.env.JWT_SEC as string, {
		expiresIn: "3d",
	});

	const userObj = user.toObject();
	delete userObj.password;

	res.status(200).json({
		message: "✅ Logged in successfully",
		userObj,
		token,
	});
};

export const myProfile = async (req: AuthenticatedRequest, res: any) => {
	const user = req.user;
	console.log("userService -> myProfile() -> user: ", user);
	res.status(200).json(user);
};

export const addToPlaylist = async (
	req: AuthenticatedRequest & { params: { id: string } },
	res: any,
) => {
	const userId = req.user?._id;
	const user = await User.findById(userId);

	if (!user) {
		res.status(404).json({
			message: "❌ NO user with this id",
		});
		return;
	}

	// if already saved, remove
	if (user?.playlist.includes(req.params.id)) {
		const index = user.playlist.indexOf(req.params.id);
		user.playlist.splice(index, 1);
		await user.save();

		res.json({
			message: "✅ Song removed from playlist",
		});
		return;
	}

	// if not saved, include
	user.playlist.push(req.params.id);
	await user.save();

	res.status(201).json({
		message: "✅ Song added to playList",
	});

	//⚠️ EI CONTROLLER ER KAJ COMPLETE KORSI. EKHON LOADING STATE TA THIK KORTE HOBE.
	// AMI SONG SAVE KORLE WHOLE PAGE RELOAD HOCCHE. RESOLVE THE ISSUE
};
