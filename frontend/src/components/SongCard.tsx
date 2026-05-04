import React from "react";
import { FaBookmark, FaPlay } from "react-icons/fa";
import CloudinaryImage from "./CloudinaryImage";
import { useUserData } from "@/context/UserContext";
import { useSongData } from "@/context/SongContext";

interface SongCardProps {
	id: string;
	thumbnail: string;
	title: string;
	description: string;
	album_id: string;
	album_title: string;
}

const SongCard: React.FC<SongCardProps> = ({
	id,
	thumbnail,
	title,
	description,
	album_id,
	album_title,
}) => {
	const { addToPlaylist, isAuthenticated, addToPlaylistLoading } =
		useUserData();

	const { setSelectedSong, setIsPlaying } = useSongData();

	const saveToPlayListHanlder = () => {
		addToPlaylist(id);
	};

	return (
		<div className="SONGCARD min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]">
			<div className="relative group">
				{thumbnail == null ? (
					<img
						src={"/musicLogo.png"}
						className="rounded w-[160px] aspect-square object-cover"
						alt="Default"
					/>
				) : (
					<CloudinaryImage
						songThumbnail={thumbnail}
						className="rounded w-[160px] aspect-square object-cover"
					/>
				)}

				<div className="flex gap-2">
					<button
						onClick={() => {
							setSelectedSong(id);
							setIsPlaying(true);
						}}
						className="absolute bottom-2 right-14 bg-green-500 text-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
					>
						<FaPlay />
					</button>

					{isAuthenticated && (
						<button
							disabled={addToPlaylistLoading}
							className="absolute bottom-2 right-2 bg-green-500 text-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
							onClick={() => {
								saveToPlayListHanlder();
							}}
						>
							<FaBookmark />
						</button>
					)}
				</div>
			</div>

			<p className="font-bold mt-2 mb-1">{title}</p>
			<p className="text-slate-200 text-sm">
				{description.slice(0, 20)}...
			</p>
			<p className="font-extralight text-xs mt-2 mb-1">{album_title}</p>
		</div>
	);
};

export default SongCard;
