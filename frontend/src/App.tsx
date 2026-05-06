import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useUserData } from "./context/UserContext";
import { Spinner } from "./components/ui/spinner";
import Register from "./pages/Register";
import Album from "./pages/Album";
import Layout from "./components/Layout";
import { Navigate } from "react-router-dom";
import PlayList from "./pages/PlayList";

const App = () => {
	const { isAuthenticated, loading } = useUserData();
	return (
		<BrowserRouter>
			{loading ? (
				<Spinner />
			) : (
				<Routes>
					{/* PUBLIC/AUTH ROUTES (No Layout) */}
					<Route
						path="/login"
						element={
							isAuthenticated ? (
								<Navigate to="/" replace />
							) : (
								<Login />
							)
						}
					/>
					<Route
						path="/register"
						element={
							isAuthenticated ? (
								<Navigate to="/" replace />
							) : (
								<Register />
							)
						}
					/>

					{/* PROTECTED APP ROUTES (With Layout) */}
					<Route element={<Layout />}>
						<Route path="/" element={<Home />} />
						<Route path="/album/:id" element={<Album />} />
						<Route
							path="/playlist"
							element={
								isAuthenticated ? (
									<PlayList />
								) : (
									<Navigate to="/login" replace />
								)
							}
						/>
					</Route>
				</Routes>
			)}
		</BrowserRouter>
	);
};

export default App;
