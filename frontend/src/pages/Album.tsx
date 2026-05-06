import { useParams } from "react-router-dom";
import { useSongData } from "../context/SongContext";
import { useEffect } from "react";
import { FaBookmark, FaPlay } from "react-icons/fa";
import { useUserData } from "../context/UserContext";
import { Spinner } from "@/components/ui/spinner";
import CloudinaryImage from "@/components/CloudinaryImage";

const Album = () => {
	const {
		fetchAlbumsongs,
		albumSongs,
		albumData,
		setIsPlaying,
		setSelectedSong,
		loading,
	} = useSongData();

	const { isAuthenticated, addToPlaylist } = useUserData();

	const params = useParams<{ id: string }>();

	useEffect(() => {
		if (params.id) {
			fetchAlbumsongs(params.id);
		}
	}, [params.id]);

	return (
		<div>
			{loading ? (
				<Spinner />
			) : (
				<>
					{albumData && (
						<div className="ALBUM mt-10">
							<div className="TOP flex gap-8 flex-col md:flex-row md:items-center">
								{albumData.album_thumb ? (
									<CloudinaryImage
										songThumbnail={albumData.album_thumb}
										className="rounded w-[160px] aspect-square object-cover"
									/>
								) : (
									<img
										src={"/musicLogo.png"}
										className="w-[160px] rounded aspect-square object-cover"
										alt=""
									/>
								)}

								<div className="flex flex-col">
									<p>PlayList</p>
									<h2 className="text-2xl font-bold mb-4 md:text-5xl">
										{albumData.album_title} PlayList
									</h2>
									<h4 className="text-xs md:text-md">
										{albumData.album_desc}
									</h4>
									<p className="mt-1">
										<img
											src="/logo.png"
											className="inline-block w-6"
											alt=""
										/>
									</p>
								</div>
							</div>

							<div className="MIDDLE grid grid-cols-2 md:grid-cols-3 text-xs md:text-lg mt-10 mb-4 pl-2 text-[#a7a7a7]">
								<p>
									<b className="mr-4">#</b>
								</p>
								<p className="hidden md:inline-block">
									Description
								</p>
								<p className="text-center">Actions</p>
							</div>

							<hr />

							{albumSongs &&
								albumSongs.map((song, index) => {
									return (
										<div
											className="grid grid-cols-2 md:grid-cols-3 mt-10 mb-4 pl-2 text-[#a7a7a7] text-xs md:text-lg hover:bg-[#ffffff2b] cursor-pointer"
											key={song.id}
										>
											<p className="text-white flex items-center flex-nowrap">
												<b className="mr-4 text-[#a7a7a7] text-xs md:text-lg">
													{index + 1}
												</b>{" "}
												{song.thumbnail ? (
													<CloudinaryImage
														songThumbnail={
															song.thumbnail
														}
														className="rounded w-10 mr-5 aspect-square object-cover"
													/>
												) : (
													<img
														src={"/musicLogo.png"}
														className="w-10 mr-5 rounded aspect-square object-cover"
														alt=""
													/>
												)}{" "}
												{song.title}
											</p>

											<p className="text-xs md:text-lg hidden md:flex items-center justify-center">
												{song.description.slice(0, 30)}
												...
											</p>

											<p className="BUTTONS flex justify-center items-center gap-5 text-right">
												{isAuthenticated && (
													<button
														onClick={() =>
															addToPlaylist(
																song.id,
															)
														}
														className="text-xs md:text-lg text-center"
													>
														<FaBookmark />
													</button>
												)}

												<button
													className="text-xs md:text-lg text-center"
													onClick={() => {
														setSelectedSong(
															song.id,
														);
														setIsPlaying(true);
													}}
												>
													<FaPlay />
												</button>
											</p>
										</div>
									);
								})}
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default Album;
