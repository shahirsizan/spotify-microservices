import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { useUserData } from "../context/UserContext";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const navigate = useNavigate();

	// const { loginUser, btnLoading } = useUserData();

	// async function submitHandler(e: any) {
	// 	e.preventDefault();

	// 	loginUser(email, password, navigate);
	// }

	return (
		<div className="h-screen max-h-screen flex items-center justify-center">
			<div className="bg-gray-700 text-white p-8 rounded-lg shadow-lg max-w-md w-full">
				<h2 className="text-3xl font-semibold text-center mb-8">
					Login To Spotify
				</h2>

				<form className="mt-8">
					<div className="mb-4">
						<label
							htmlFor="emailid"
							className="block text-sm font-medium mb-1"
						>
							Email or username
						</label>
						<input
							id="emailid"
							type="email"
							placeholder="Email or username"
							className="auth-input"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>

					<div className="mb-4">
						<label
							htmlFor="passid"
							className="block text-sm font-medium mb-1"
						>
							Password
						</label>
						<input
							id="passid"
							type="password"
							placeholder="Enter Password"
							className="auth-input"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>

					<button className="auth-btn">Login</button>
				</form>

				<div className="text-center mt-6">
					<Link
						to={"/register"}
						className="text-sm text-gray-400 hover:text-gray-300"
					>
						Don't have an Account?
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Login;
