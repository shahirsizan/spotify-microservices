import axios from "axios";
import React, {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

const server = "http://localhost:8000";

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
	fetchSingleSong: () => Promise<void>;
	fetchAlbumsongs: (id: string) => Promise<void>;
	fetchSongs: () => Promise<void>;
	fetchAlbums: () => Promise<void>;
	nextSong: () => void;
	prevSong: () => void;
	albumSong: Song[];
	albumData: Album | null;
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
	const [albumData, setAlbumData] = useState<Album | null>(null);
	const [albumSong, setAlbumSong] = useState<Song[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [selectedSong, setSelectedSong] = useState<string | null>(null);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const [albums, setAlbums] = useState<Album[]>([]);

	// ✅
	const fetchSongs = useCallback(async () => {
		setLoading(true);

		try {
			const { data } = await axios.get<Song[]>(
				`${server}/api/v1/song/all`,
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
			console.log("data(songs) in frontend: ", data);

			if (data.length > 0) {
				setSelectedSong(data[0].id.toString());
			}

			setIsPlaying(false);
		} catch (error) {
			console.error("❌ fetchSongs error: ", error);
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
				`${server}/api/v1/album/all`,
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
		} finally {
			setLoading(false);
		}
	}, []);

	// ✅
	useEffect(() => {
		fetchAlbums();
	}, []);

	const fetchSingleSong = useCallback(async () => {
		// fetchSongs() call in useEffect will select a song at the very beginning
		if (!selectedSong) {
			return;
		}

		try {
			const { data } = await axios.get<Song>(
				`${server}/api/v1/song/${selectedSong}`,
			);
			setSong(data);
		} catch (error) {
			console.log(error);
		}
	}, [selectedSong]);

	const [index, setIndex] = useState<number>(0);

	const nextSong = useCallback(() => {
		if (index === songs.length - 1) {
			setIndex(0);
			setSelectedSong(songs[0]?.id.toString());
		} else {
			setIndex((prevIndex) => prevIndex + 1);
			setSelectedSong(songs[index + 1]?.id.toString());
		}
	}, [index, songs]);

	const prevSong = useCallback(() => {
		if (index > 0) {
			setIndex((prev) => prev - 1);
			setSelectedSong(songs[index - 1]?.id.toString());
		}
	}, [index, songs]);

	// ✅
	const fetchAlbumsongs = useCallback(async (id: string) => {
		setLoading(true);

		try {
			// const { data } = await axios.get<{ songs: Song[]; album: Album }>(
			// 	`${server}/api/v1/album/${id}`,
			// );

			const { data } = await axios.get<{ songs: Song[]; album: Album }>(
				`${server}/api/v1/album/${id}`,
			);

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

			setAlbumData(data.album);
			setAlbumSong(data.songs);
		} catch (error) {
			console.log("❌ fetchAlbumsongs error: ", error);
		} finally {
			setLoading(false);
		}
	}, []);

	const valueObj = useMemo(
		() => ({
			songs,
			selectedSong,
			setSelectedSong,
			isPlaying,
			setIsPlaying,
			loading,
			albums,
			fetchSingleSong,
			song,
			nextSong,
			prevSong,
			fetchAlbumsongs,
			albumData,
			albumSong,
			fetchSongs,
			fetchAlbums,
		}),
		[
			song,
			songs,
			selectedSong,
			isPlaying,
			loading,
			albums,
			albumData,
			albumSong,
			nextSong,
			prevSong,
		], // Only updates when these dependencies change
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
