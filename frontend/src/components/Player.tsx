import React, { useEffect, useMemo, useRef, useState } from "react";
import { Song, useSongData } from "../context/SongContext";
import { GrChapterNext, GrChapterPrevious } from "react-icons/gr";
import { FaPause, FaPlay } from "react-icons/fa";

import CloudinaryImage from "./CloudinaryImage";
import { Spinner } from "./ui/spinner";

const Player = () => {
	const {
		song,
		fetchSingleSong,
		selectedSong,
		isPlaying,
		setIsPlaying,
		prevSong,
		nextSong,
		loading,
	} = useSongData();

	const audioRef = useRef<HTMLAudioElement | null>(null);

	const [volume, setVolume] = useState<number>(0.5);
	const [progress, setProgress] = useState<number>(0);
	const [duration, setDuration] = useState<number>(0);

	// POPULATE `duration` AND `progress` STATES WHEN <audio/> loaded with `song`
	const handleLoadedMetaData = () => {
		if (audioRef.current) {
			setDuration(audioRef.current?.duration || 0);
		}
	};
	const handleTimeUpdate = () => {
		if (audioRef.current) {
			setProgress(audioRef.current?.currentTime);
		}
	};

	const handlePlayPause = () => {
		if (audioRef.current) {
			if (isPlaying) {
				audioRef.current.pause();
			} else {
				audioRef.current.play();
			}
			setIsPlaying(!isPlaying);
		}
	};

	const volumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newVolume = parseFloat(e.target.value) / 100;
		setVolume(newVolume);
		if (audioRef.current) {
			audioRef.current.volume = newVolume;
		}
	};

	const durationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newTime = (parseFloat(e.target.value) / 100) * duration;
		if (audioRef.current) {
			audioRef.current.currentTime = newTime;
		}
		setProgress(newTime);
	};

	// trigger `fetchSingleSong()` to fetch that song when clicked
	useEffect(() => {
		fetchSingleSong();
	}, [selectedSong]);

	// useEffect(()=>{},[song])

	if (loading) {
		return (
			<div className=" bg-yellow-500 flex items-center justify-center text-2xl font-bold">
				LOADING SONG...
			</div>
		);
	}

	return (
		<div className="PLAYER">
			{song && (
				<div className="h-[10%] bg-black flex justify-between items-center text-white px-4">
					{/* LEFT */}
					<div className="LEFT md:flex items-center gap-4">
						{song.thumbnail == null ? (
							// default image
							<img
								src={"/musicLogo.png"}
								className="rounded w-12 aspect-square object-cover"
								alt="Default"
							/>
						) : (
							// song image
							<CloudinaryImage songThumbnail={song?.thumbnail} />
						)}

						{/* title-description */}
						<div className="hidden md:block">
							<p className="text-sm">{song.title}</p>
							<p className="text-xs">
								{song.description?.slice(0, 30)}...
							</p>
						</div>
					</div>

					{/* MIDDLE */}
					<div className="MIDDLE flex flex-col items-center gap-1 mx-auto">
						{/* invisible audio element */}
						{song.audio && (
							<audio
								ref={audioRef}
								src={`https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/video/upload/${song.audio}.mp3`}
								autoPlay={isPlaying}
								onLoadedData={() => {
									handleLoadedMetaData();
								}}
								onTimeUpdate={() => {
									handleTimeUpdate();
								}}
							/>
						)}

						{/* visible representation */}
						<div className="w-full items-center flex font-thin text-green-400">
							<input
								type="range"
								min={"0"}
								max={"100"}
								value={(progress / duration) * 100 || 0}
								onChange={durationChange}
								className="progress-bar w-[120px] md:w-[300px]"
							/>
						</div>

						{/* player buttons */}
						<div className="flex justify-center items-center gap-4">
							<span className="cursor-pointer" onClick={prevSong}>
								<GrChapterPrevious />
							</span>

							<button
								className="bg-white text-black rounded-full p-2"
								onClick={handlePlayPause}
							>
								{isPlaying ? <FaPause /> : <FaPlay />}
							</button>

							<span className="cursor-pointer" onClick={nextSong}>
								<GrChapterNext />
							</span>
						</div>
					</div>

					{/* RIGHT  */}
					{/* VOLUME SLIDER */}
					<div className="RIGHT flex lg:flex-none items-center">
						<input
							type="range"
							className="w-16 md:w-32"
							min={"0"}
							max={"100"}
							step={5}
							value={volume * 100}
							onChange={volumeChange}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default Player;
