import AlbumCard from "@/components/AlbumCard";
import Layout from "@/components/Layout";
import SongCard from "@/components/SongCard";
import { Spinner } from "@/components/ui/spinner";
import { useSongData } from "@/context/SongContext";

const Home = () => {
	const { albums, songs, loading, isError } = useSongData();

	/***
	 * each of the album: {
					album_id: item.id.toString(),
					album_title: item.title,
					album_desc: item.description,
					album_thumb: item.thumbnail,
				}
	 */

	return (
		// 		{loading ? (
		// 				<Spinner className="size-20 font-bold text-blue-800" />
		// 			) : isError ? (
		// 				<div className="h-screen flex items-center justify-center bg-red-900 text-white text-2xl font-bold">
		// 					Error!
		// 				</div>
		// 			) : (<Layout> code here)
		// }
		<div className="">
			<Layout>
				{/* Albums Cards */}
				<div className="mb-4">
					<h1 className="my-5 font-bold text-2xl">Featured Charts</h1>
					<div className="flex overflow-auto">
						{albums?.map((album, idx) => {
							return (
								<AlbumCard
									key={idx}
									image={album.album_thumb}
									name={album.album_title}
									desc={album.album_desc}
									id={album.album_id}
								/>
							);
						})}
					</div>
				</div>

				{/* Biggest hits cards */}
				<div className="mb-4">
					<h1 className="my-5 font-bold text-2xl">
						Today's biggest hits
					</h1>
					<div className="flex overflow-auto">
						{songs?.map((song, i) => {
							return (
								<SongCard
									key={i}
									id={song.id}
									thumbnail={song.thumbnail}
									title={song.title}
									description={song.description}
									album_id={song.album_id}
									album_title={song.album_title}
								/>
							);
						})}
					</div>
				</div>
			</Layout>
		</div>
	);
};

export default Home;
