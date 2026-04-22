import Layout from "@/components/Layout";

const Home = () => {
	return (
		<div className="">
			<Layout>
				<div className="mb-4">
					<h1 className="my-5 font-bold text-2xl">Featured Charts</h1>
				</div>

				<div className="mb-4">
					<h1 className="my-5 font-bold text-2xl">
						Today's biggest hits
					</h1>
				</div>
			</Layout>
		</div>
	);
};

export default Home;
