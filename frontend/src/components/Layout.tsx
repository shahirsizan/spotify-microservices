import React, { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Player from "./Player";

interface LayoutProps {
	children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<div className="ENTIRESCREEN h-screen">
			<div className="TOPBOX h-[90%]  flex">
				<Sidebar />
				<div className="RIGHTPART w-[100%] m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto lg:w-[75%] lg:ml-0">
					<Navbar />
					{children}
				</div>
			</div>

			<Player />
		</div>
	);
};

export default Layout;
