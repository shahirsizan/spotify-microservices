import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Album from "./pages/Album";
import PlayList from "./pages/PlayList";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/album/:id" element={<Album />} />
					<Route path="/playlist" element={<PlayList />} />
					<Route path="/admin/dashboard" element={<Admin />} />
					<Route path="/login" element={<Home />} />
					<Route path="/register" element={<Register />} />
				</Routes>
			</BrowserRouter>
		</>
	);
};

export default App;
