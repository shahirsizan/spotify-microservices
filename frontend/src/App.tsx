import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useUserData } from "./context/UserContext";
import { Spinner } from "./components/ui/spinner";

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
					</Routes>
				</BrowserRouter>
			)}
		</>
	);
};

export default App;
