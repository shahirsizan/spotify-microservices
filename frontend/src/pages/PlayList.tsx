import CloudinaryImage from "@/components/CloudinaryImage";
import { Spinner } from "@/components/ui/spinner";
import { Song, useSongData } from "@/context/SongContext";
import { useUserData } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { FaBookmark, FaPlay } from "react-icons/fa";

const PlayList = () => {
	const { songs, setIsPlaying, setSelectedSong, loading } = useSongData();
	const { user, addToPlaylist } = useUserData();
	const [myPlayList, setMyPlayList] = useState<Song[]>([]);

	useEffect(() => {
		if (songs && user) {
			const filteredSongs = songs.filter((song) =>
				user.playlist.includes(song.id.toString()),
			);
			setMyPlayList(filteredSongs);
		}
	}, [songs, user]);

	return (
		<div className="ALBUM mt-10">
			{loading ? (
				<Spinner />
			) : (
				<>
					{myPlayList && (
						<div>
							<div className="flex gap-8 flex-col md:flex-row md:items-center">
								<img
									src={"/musicLogo.png"}
									className="w-[160px] rounded aspect-square object-cover"
									alt=""
								/>

								<div className="flex flex-col">
									<p>PlayList</p>
									<h2 className="text-2xl font-bold mb-4 md:text-5xl">
										{user?.name}'s PlayList
									</h2>
									<h4 className="text-xs md:text-md">
										Your Favourate songs
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

							{myPlayList &&
								myPlayList.map((song, index) => {
									return (
										<div
											className="grid grid-cols-2 md:grid-cols-3 mt-10 mb-4 pl-2 text-[#a7a7a7] text-xs md:text-lg hover:bg-[#ffffff2b] cursor-pointer"
											key={song.id}
										>
											<p className="text-white">
												<b className="mr-4 text-[#a7a7a7]">
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

											<p className="text-[15px] hidden sm:block">
												{song.description.slice(0, 30)}
												...
											</p>

											<p className="BUTTONS flex justify-center items-center gap-5">
												<button
													onClick={() =>
														addToPlaylist(song.id)
													}
													className="text-xs md:text-lg text-center"
												>
													<FaBookmark />
												</button>

												<button
													onClick={() => {
														setSelectedSong(
															song.id,
														);
														setIsPlaying(true);
													}}
													className="text-xs md:text-lg text-center"
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

export default PlayList;
