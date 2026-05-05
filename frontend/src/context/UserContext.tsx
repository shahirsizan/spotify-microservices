/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import React, {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import toast, { Toaster } from "react-hot-toast";

const userServer = "http://localhost:5000";

export interface User {
	_id: string;
	name: string;
	email: string;
	role: string;
	playlist: string[];
}

interface UserContextType {
	user: User | null;
	isAuthenticated: boolean;
	loading: boolean;
	addToPlaylistLoading: boolean;
	btnLoading: boolean;
	loginUser: (
		email: string,
		password: string,
		navigate: (path: string) => void,
	) => Promise<void>;
	registerUser: (
		name: string,
		email: string,
		password: string,
		navigate: (path: string) => void,
	) => Promise<void>;
	addToPlaylist: (id: string) => void;
	logoutUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(false);
	const [addToPlaylistLoading, setAddToPlaylistLoading] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [btnLoading, setBtnLoading] = useState(false);

	// ✅
	const registerUser = useCallback(
		async (
			name: string,
			email: string,
			password: string,
			navigate: (path: string) => void,
		) => {
			setBtnLoading(true);

			try {
				const { data } = await axios.post(
					`${userServer}/api/v1/user/register`,
					{
						name,
						email,
						password,
					},
				);

				toast.success(data.message);
				localStorage.setItem("token", data.token);
				setUser(data.user);
				setIsAuthenticated(true);
				navigate("/");
			} catch (error: any) {
				toast.error(
					error.response?.data?.message || "An error occured",
				);
			} finally {
				setBtnLoading(false);
			}
		},
		[],
	);

	// ✅
	const loginUser = useCallback(
		async (
			email: string,
			password: string,
			navigate: (path: string) => void,
		) => {
			setBtnLoading(true);

			try {
				const { data } = await axios.post(
					`${userServer}/api/v1/user/login`,
					{
						email,
						password,
					},
				);

				toast.success(data.message);
				localStorage.setItem("token", data.token);
				setUser(data.user);
				setIsAuthenticated(true);
				console.log("✅ Logged in successfully");

				navigate("/");
			} catch (error: any) {
				toast.error(
					error.response?.data?.message || "An error occured",
				);
			} finally {
				setBtnLoading(false);
			}
		},
		[],
	);

	// ✅
	const logoutUser = async () => {
		// localStorage.removeItem("token"); will also work. But we prefer erasing every info about the user
		localStorage.clear();
		setUser(null);
		setIsAuthenticated(false);

		toast.success("✅ User Logged Out");
	};

	const addToPlaylist = async (id: string) => {
		// state to render loading spinner in the `add to playlist` button upon press
		setAddToPlaylistLoading(true);

		try {
			const { data } = await axios.post(
				`${userServer}/api/v1/song/${id}`,
				{},
				{
					headers: {
						token: localStorage.getItem("token"),
					},
				},
			);

			console.log("✅ addToPlaylist() data: ", data);
			toast.success(data.message);
			// fetch the user again to get the updated user
			// fetchUser();
		} catch (error: any) {
			toast.error(
				error.response?.data?.message ||
					"❌ An Error Occured in addToPlaylist()",
			);
		} finally {
			setAddToPlaylistLoading(false);
		}
	};

	async function fetchUser() {
		setLoading(true);

		try {
			const { data } = await axios.get(`${userServer}/api/v1/user/me`, {
				headers: {
					token: localStorage.getItem("token"),
				},
			});

			setUser(data);
			setIsAuthenticated(true);
			// console.log("✅ fetchUser() data: ", data);
		} catch (error) {
			console.log("❌ Error in fetchUser(): ", error);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		fetchUser();
	}, []);

	return (
		<UserContext.Provider
			value={{
				user,
				loading,
				isAuthenticated,
				btnLoading,
				loginUser,
				registerUser,
				logoutUser,
				addToPlaylist,
				addToPlaylistLoading,
			}}
		>
			{children}
			<Toaster />
		</UserContext.Provider>
	);
};

export const useUserData = (): UserContextType => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error("useUserData must be used within a UserProvider");
	}
	return context;
};
