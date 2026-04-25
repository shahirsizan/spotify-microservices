import { sql } from "./index.js";
import { redisClient } from "./config/redis.js";

interface reqType extends Request {
	params?: any;
}

export const getAllAlbums = async (req: reqType, res: any) => {
	try {
		let albums;
		const CACHE_EXPIRY = 1800; // 30 minutes

		// if (redisClient.isReady) {
		// 	albums = await redisClient.get("albums");
		// }

		if (albums) {
			console.log("✅ Cache hit.");
			res.status(200).json(JSON.parse(albums));
			return;
		} else {
			console.log("⚠️ Cache miss.");
			albums = await sql`SELECT * FROM albums`;

			if (redisClient.isReady) {
				await redisClient.set("albums", JSON.stringify(albums), {
					EX: CACHE_EXPIRY,
				});

				res.status(200).json(albums);
				return;
			}
		}
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
	}
};

export const getAllSongs = async (req: reqType, res: any) => {
	try {
		let songs;
		const CACHE_EXPIRY = 1800; // 30 minutes

		// if (redisClient.isReady) {
		// 	songs = await redisClient.get("songs");
		// }

		if (songs) {
			console.log("✅ Cache hit.");
			res.status(200).json(JSON.parse(songs));
			return;
		} else {
			console.log("⚠️ Cache miss.");
			songs =
				await sql`SELECT albums.id as album_id, albums.title as album_title, songs.* 
				FROM songs left join albums on songs.album_id = albums.id`;

			if (redisClient.isReady) {
				await redisClient.set("songs", JSON.stringify(songs), {
					EX: CACHE_EXPIRY,
				});
			}

			res.status(200).json(songs);
			return;
		}
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
	}
};

export const getAllSongsOfAlbum = async (req: reqType, res: any) => {
	try {
		const CACHE_EXPIRY = 1800; // 30 minutes
		const { id } = req.params;

		let songsOfAlbum;

		// if (redisClient.isReady) {
		// 	let songsOfAlbum = await redisClient.get(`album_songs_${id}`);
		// 	if (songsOfAlbum) {
		// 		console.log("✅ Cache hit");
		// 		res.status(200).json(JSON.parse(songsOfAlbum));
		// 		return;
		// 	}
		// }

		songsOfAlbum = await sql`
		SELECT albums.id as album_id, albums.title as album_title, albums.description as album_desc, albums.thumbnail as album_thumb, songs.* 
		from albums left join songs on albums.id = songs.album_id
		where albums.id = ${id}`;

		// console.log("songsOfAlbum: ", songsOfAlbum);

		if (songsOfAlbum.length === 0) {
			return res
				.status(404)
				.json({ message: "❌ Album not found with this id" });
		}

		// format the response
		const response = {
			songs: songsOfAlbum,
			album: {
				album_id: songsOfAlbum[0]?.album_id,
				album_title: songsOfAlbum[0]?.album_title,
				album_desc: songsOfAlbum[0]?.album_desc,
				album_thumb: songsOfAlbum[0]?.album_thumb,
			},
		};

		// console.log("response: ", response);

		if (redisClient.isReady) {
			await redisClient.set(
				`album_songs_${id}`,
				JSON.stringify(response),
				{
					EX: CACHE_EXPIRY,
				},
			);
		}

		return res.status(200).json(response);
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
	}
};

export const getSingleSong = async (req: reqType, res: any) => {
	try {
		const CACHE_EXPIRY = 1800; // 30 minutes
		let song;

		// if (redisClient.isReady) {
		// 	song = await redisClient.get(`song_${req.params?.id}`);
		// 	if (song) {
		// 		console.log("✅ Cache hit");
		// 		res.status(200).json(JSON.parse(song));
		// 		return;
		// 	}
		// }

		song = await sql`SELECT * FROM songs WHERE id = ${req.params.id}`;

		if (song.length == 0) {
			res.status(404).json({ message: "❌ No song found with given id" });
			return;
		}

		if (redisClient.isReady) {
			await redisClient.set(
				`song_${req.params.id}`,
				JSON.stringify(song[0]),
				{ EX: CACHE_EXPIRY },
			);
		}

		res.status(200).json(song[0]);
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
	}
};
