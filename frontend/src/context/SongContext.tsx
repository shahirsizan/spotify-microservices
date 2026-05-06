/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { Cloudinary, CloudinaryImage } from "@cloudinary/url-gen";
import React, {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

const songServer = "http://localhost:8000";

export interface Song {
	id: string;
	title: string;
	description: string;
	thumbnail: string;
	audio: string;
	album_id: string;
	album_title: string;
}

export interface Album {
	album_id: string;
	album_title: string;
	album_desc: string;
	album_thumb: string;
}

interface SongContextType {
	song: Song | null;
	songs: Song[];
	albums: Album[];
	selectedSong: string | null;
	setSelectedSong: (id: string) => void;
	isPlaying: boolean;
	setIsPlaying: (value: boolean) => void;
	loading: boolean;
	setLoading: (value: boolean) => void;
	playerLoading: boolean;
	setPlayerLoading: (value: boolean) => void;
	isError: boolean;
	fetchSingleSong: () => Promise<void>;
	fetchAlbumsongs: (id: string) => Promise<void>;
	fetchSongs: () => Promise<void>;
	fetchAlbums: () => Promise<void>;
	nextSong: () => void;
	prevSong: () => void;
	albumSongs: Song[];
	albumData: Album | null;
	cloudinaryImageInitializer: (songThumbnail: string) => CloudinaryImage;
}

/***
 * useCallback dependency array logic:
 1. User Explicitly Changing Things: 
		Parameters (Input) = NEVER in the array
		When user types in a search bar, they are updating a state variable. If the method uses that 
		state variable directly (without being passed as parameter), then it must be in the array.
 2. Machine/Runtime Changes: 
		If a function "reaches out" to grab a variable defined outside of itself, 
		that is a reactive dependency.
 		If a variable like `server` or a `token` comes from a config file or another Context and 
		changes during runtime, the function needs to be aware. So they must be in the array.
 */

const SongContext = createContext<SongContextType | undefined>(undefined);

export const SongProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [song, setSong] = useState<Song | null>(null);
	const [songs, setSongs] = useState<Song[]>([]);
	const [index, setIndex] = useState<number>(0);
	const [albumData, setAlbumData] = useState<Album | null>(null);
	const [albumSongs, setAlbumSongs] = useState<Song[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	//⚠️ nicher state diye `player` loading state control korte hobe. Global `loading` state diye na.
	const [playerLoading, setPlayerLoading] = useState<boolean>(true);
	const [selectedSong, setSelectedSong] = useState<string | null>(null);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const [albums, setAlbums] = useState<Album[]>([]);
	const [isError, setIsError] = useState<boolean>(false);

	// initialize cloudinary image component
	const cloudinaryImageInitializer = useCallback((songThumbnail: string) => {
		const cloudinaryInstance = new Cloudinary({
			cloud: { cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME },
		});
		const cloudniaryImageObj = cloudinaryInstance.image(songThumbnail);
		return cloudniaryImageObj;
	}, []);

	// ✅
	const fetchSongs = useCallback(async () => {
		setLoading(true);

		try {
			const { data } = await axios.get<Song[]>(
				`${songServer}/api/v1/song/all`,
			);

			/***
			 * export interface Song {
					album_id: string;
					album_title: string;
					album_desc: string;
					album_thumb: string;
					id: string;
					title: string;
					description: string;
					thumbnail: string;
					audio: string;
}
			 */

			/***
			 * `data` is:
				* [
					{
						"album_id": 3,
						"album_title": "English",
						"id": 7,
						"title": "Zombie",
						"description": "Description of Zombie",
						"thumbnail": null,
						"audio": "songs/yiy9u4tg1ejlwjcx2oqz",
						"created_at": "2026-04-20T02:36:26.839Z"
					},
						........
					]
			 */

			setSongs(data);
			console.log("✅ fetchSongs() -> data: ", data);

			// fix: only set song if one isn't already selected
			if (data.length > 0 && !selectedSong) {
				setSelectedSong(data[0].id.toString());
			}

			// fix: don't call setIsPlaying(false) here. Let the existing state persist.
			// setIsPlaying(false);
		} catch (error) {
			console.error("❌ fetchSongs error: ", error);
			setIsError(true);
		} finally {
			setLoading(false);
		}
	}, []);

	// ✅
	useEffect(() => {
		fetchSongs();
	}, []);

	// ✅
	const fetchAlbums = useCallback(async () => {
		setLoading(true);

		try {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const { data } = await axios.get<any[]>(
				`${songServer}/api/v1/album/all`,
			);
			// console.log("✅ data in frontend context: ", data);
			/***
			 * `data` is:
			* [
				 {
					"id": 3,
					"title": "English",
					"description": "Description of English Album",
					"thumbnail": "albums/nfbend1uiwb4pg8a2hpt",
					"created_at": "2026-04-17T09:35:57.564Z"
				},
				{
					"id": 4,
					"title": "Iranian",
					"description": "Description of Iranian Album",
					"thumbnail": "albums/t19ietjeltbstfdtuabo",
					"created_at": "2026-04-17T09:36:45.430Z"
				},
				....
			]
			 * 
			 */
			// Transform the "raw" data into your specific interface
			const mappedData: Album[] = data.map((item) => ({
				album_id: item.id.toString(),
				album_title: item.title,
				album_desc: item.description,
				album_thumb: item.thumbnail,
			}));

			setAlbums(mappedData);
			// console.log("✅ mappedData in frontend context: ", mappedData);
		} catch (error) {
			console.log("❌ fetchAlbums error: ", error);
			setIsError(true);
		} finally {
			setLoading(false);
		}
	}, []);

	// ✅
	useEffect(() => {
		fetchAlbums();
	}, []);

	// ✅
	const fetchSingleSong = useCallback(async () => {
		// `selectedSong` state is set in `fetchSongs()` in a useEffect at the very beginning.
		if (!selectedSong) {
			return;
		}

		setPlayerLoading(true);

		try {
			const { data } = await axios.get<Song>(
				`${songServer}/api/v1/song/${selectedSong}`,
			);

			console.log("✅ fetchSingleSong() -> data: ", data);
			setSong(data);
		} catch (error) {
			console.log("❌ Error in fetchSingleSong(): ", error);
		} finally {
			setPlayerLoading(false);
		}
	}, [selectedSong]);

	// ✅
	const nextSong = useCallback(() => {
		const updatedIdx = (index + 1) % songs.length;
		setIndex(updatedIdx);
		setSelectedSong(songs[updatedIdx]?.id.toString());
	}, [index, songs]);

	// ✅
	const prevSong = useCallback(() => {
		const updatedIdx = (index - 1 + songs.length) % songs.length;
		setIndex(updatedIdx);
		setSelectedSong(songs[updatedIdx]?.id.toString());
	}, [index, songs]);

	// ✅
	const fetchAlbumsongs = useCallback(
		async (id: string) => {
			setLoading(true);

			try {
				const { data } = await axios.get<{
					songs: Song[];
					album: Album;
				}>(`${songServer}/api/v1/album/${id}`);

				/***
			 * `data` is:
				* {
					"songs": [
						{
								"album_id": 3,
								"album_title": "English",
								"album_desc": "Description of English Album",
								"album_thumb": "albums/nfbend1uiwb4pg8a2hpt",
								"id": 3,
								"title": "Starboy",
								"description": "Description of Starboy",
								"thumbnail": "albums/oulxkfbive9wav2q3e5t",
								"audio": "songs/senksh7riiiazupt3rp0",
								"created_at": "2026-04-17T09:38:01.705Z"
						},
						{
								"album_id": 3,
								"album_title": "English",
								"album_desc": "Description of English Album",
								"album_thumb": "albums/nfbend1uiwb4pg8a2hpt",
								"id": 7,
								"title": "Zombie",
								"description": "Description of Zombie",
								"thumbnail": null,
								"audio": "songs/yiy9u4tg1ejlwjcx2oqz",
								"created_at": "2026-04-20T02:36:26.839Z"
						}
					],
					"album": {
						"album_id": 3,
						"album_title": "English",
						"album_desc": "Description of English Album",
						"album_thumb": "albums/nfbend1uiwb4pg8a2hpt"
					}
				}
			 */

				console.log("✅ fetchAlbumsongs() -> data: ", data);
				setAlbumData(data.album);
				setAlbumSongs(data.songs);
			} catch (error) {
				console.log("❌ fetchAlbumsongs error: ", error);
			} finally {
				setLoading(false);
			}
		},
		[songServer],
	);

	const valueObj = useMemo(
		() => ({
			songs,
			song,
			selectedSong,
			setSelectedSong,
			isPlaying,
			setIsPlaying,
			loading,
			playerLoading,
			isError,
			albums,
			albumData,
			albumSongs,
			fetchSingleSong,
			nextSong,
			prevSong,
			fetchAlbumsongs,
			fetchSongs,
			fetchAlbums,
			cloudinaryImageInitializer,
		}),
		[
			song,
			songs,
			selectedSong,
			isPlaying,
			loading,
			playerLoading,
			isError,
			albums,
			albumData,
			albumSongs,
			fetchSingleSong,
			nextSong,
			prevSong,
			cloudinaryImageInitializer,
		], // update the object only when the dependencies (states) change
	);

	return (
		<SongContext.Provider value={valueObj}>{children}</SongContext.Provider>
	);
};

export const useSongData = (): SongContextType => {
	const context = useContext(SongContext);
	if (!context) {
		throw new Error("❌ useSongData context must be defined");
	}
	return context;
};
