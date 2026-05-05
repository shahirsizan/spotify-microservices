import React, { useEffect, useMemo, useRef, useState } from "react";
import { Song, useSongData } from "../context/SongContext";
import { GrChapterNext, GrChapterPrevious } from "react-icons/gr";
import { FaPause, FaPlay } from "react-icons/fa";

import CloudinaryImage from "./CloudinaryImage";
import { Spinner } from "./ui/spinner";

const Player = React.memo(() => {
	const {
		song,
		fetchSingleSong,
		selectedSong,
		isPlaying,
		setIsPlaying,
		prevSong,
		nextSong,
		playerLoading,
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

	// Sync the <audio/> elements volume whenever the song changes.
	// without this, after song change, the volume bar and the actual volume will be out of sync.
	// this will run only when the song itself changes. Not on every render.
	// for every re-renders, we have `volumeChange` event listener
	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = volume;
		}
	}, [song]);

	// trigger `fetchSingleSong()` to fetch that song when clicked
	useEffect(() => {
		console.log("called...");

		fetchSingleSong();
	}, [selectedSong]);

	/***
	 * Never use an early return like below for `loading` states in a component that needs to persist media.
	 * Instead, use conditional rendering inside the main return or overlay the loading indicator.
	 * 
	 * Here's what happens:
	 * 	1. Navigation occurs: You click the back/forward button.
		2. State Change: The new page triggers a fetch call. setLoading(true) is called in the Context.
		3. The Wipeout: The Player component sees loading is true. It executes the if (loading) branch.
		4. Audio Destruction: Because you returned a completely different div, the previous return statement (which contained your <audio> tag) is destroyed. The browser immediately stops the music because the element that was playing it no longer exists in the DOM.
		5. The Reset: When loading becomes false again, the <audio> tag is recreated from scratch, starting the song from 0:00.
	 * 
	 * The Solution: Persistent Audio
			To fix this, you must ensure the <audio> element stays in the DOM regardless of whether you are fetching new data.
	 * if (playerLoading) {
		return (
			<div className=" bg-yellow-500 flex items-center justify-center text-2xl font-bold">
				LOADING SONG...
			</div>
		);
	}
	 */

	return (
		<div className="PLAYER">
			{/* Show a small overlay/spinner instead of hiding the whole player */}
			{playerLoading && !song && (
				<div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
					<Spinner />
				</div>
			)}
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
});

export default Player;
