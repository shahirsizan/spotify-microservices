import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useUserData } from "./context/UserContext";
import { Spinner } from "./components/ui/spinner";
import Register from "./pages/Register";

const App = () => {
	/***
	 * {loading ? (
				<Spinner />
			) : (<BrowserRouter> here)}
	 */
	const { isAuthenticated, loading } = useUserData();
	return (
		<>
			{loading ? (
				<Spinner />
			) : (
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route
							path="/login"
							element={isAuthenticated ? <Home /> : <Login />}
						/>
						<Route
							path="/register"
							element={isAuthenticated ? <Home /> : <Register />}
						/>
					</Routes>
				</BrowserRouter>
			)}
		</>
	);
};

export default App;
