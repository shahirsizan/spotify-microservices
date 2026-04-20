import cloudinary from "cloudinary";
import getBuffer from "./config/dataUri.js";
import { sql } from "./index.js";
import type { Request } from "express";
import { redisClient } from "./config/redis.js";

interface IUser {
	_id: string;
	name: string;
	email: string;
	role: string;
	playlist: string[];
}

export interface AuthenticatedRequest extends Request {
	user?: IUser | null;
	file?: Express.Multer.File | undefined;
}

export const addAlbum = async (req: AuthenticatedRequest, res: any) => {
	try {
		if (req.user?.role !== "admin") {
			res.status(401).json({
				message: "❌ You are not admin.",
			});
			return;
		}

		const { title, description }: any = req.body;

		const file = req.file;

		if (!file) {
			res.status(400).json({
				message: "⚠️ No file to upload.",
			});
			return;
		}

		const fileBuffer = getBuffer(file);

		if (!fileBuffer || !fileBuffer.content) {
			res.status(500).json({
				message: "❌ Failed to generate file buffer.",
			});
			return;
		}

		const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
			folder: "albums",
			allowed_formats: ["jpg", "png"],
		});

		// CHANGED!
		// I am storing `cloud.public_id` instead of `cloud.secure_url`
		const result = await sql`
   					INSERT INTO albums (title, description, thumbnail) VALUES (${title}, ${description}, ${cloud.public_id}) RETURNING *
  					`;

		// Invalidate cache: all albums
		if (redisClient.isReady) {
			await redisClient.del(`albums`);
			console.log(`🗑️ Cache invalidated: albums`);
		}

		res.status(201).json({
			message: "✅ Album Created",
			album: result[0],
		});
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
	}
};

export const addSong = async (req: AuthenticatedRequest, res: any) => {
	try {
		if (req.user?.role !== "admin") {
			res.status(401).json({
				message: "❌ You are not admin",
			});
			return;
		}

		const { title, description, albumId } = req.body;

		const isAlbum = await sql`SELECT * FROM albums WHERE id = ${albumId}`;

		if (isAlbum.length === 0) {
			res.status(404).json({
				message: "❌ No album with this id",
			});
			return;
		}

		const file = req.file;

		if (!file) {
			res.status(400).json({
				message: "❌ No file to upload",
			});
			return;
		}

		const fileBuffer = getBuffer(file);

		if (!fileBuffer || !fileBuffer.content) {
			res.status(500).json({
				message: "❌ Failed to generate file buffer",
			});
			return;
		}

		const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
			folder: "songs",
			resource_type: "video",
		});

		const result = await sql`
						INSERT INTO songs (title, description, audio, album_id) VALUES
						(${title}, ${description}, ${cloud.public_id}, ${albumId})`;

		// Invalidate cache: songs of the album, all songs,
		if (redisClient.isReady) {
			await redisClient.del(`album_songs_${albumId}`);
			await redisClient.del(`songs`);
			console.log(`🗑️ Cache invalidated: album_songs_${albumId}, songs`);
		}

		res.json({
			message: "✅ Song Added",
		});
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
	}
};

export const addThumbnail = async (req: AuthenticatedRequest, res: any) => {
	if (req.user?.role !== "admin") {
		res.status(401).json({
			message: "❌ You are not admin",
		});
		return;
	}

	const song = await sql`SELECT * FROM songs WHERE id = ${req.params.id}`;

	if (song.length === 0) {
		res.status(404).json({
			message: "❌ No song with this id",
		});
		return;
	}

	const file = req.file;

	if (!file) {
		res.status(400).json({
			message: "❌ No file to upload",
		});
		return;
	}

	const fileBuffer = getBuffer(file);

	if (!fileBuffer || !fileBuffer.content) {
		res.status(500).json({
			message: "❌ Failed to generate file buffer",
		});
		return;
	}

	const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
		folder: "albums",
		allowed_formats: ["jpg", "png"],
	});

	const result = await sql`
						UPDATE songs SET thumbnail = ${cloud.public_id} WHERE id = ${req.params.id} RETURNING * `;

	// Invalidate cache: this song, all songs of this album, all songs
	if (redisClient.isReady) {
		await redisClient.del(`song_${req.params.id}`);
		await redisClient.del(`songs`);
		await redisClient.del(`album_songs_${req.params.id}`);
		console.log(
			`🗑️ Cache invalidated: song_${req.params.id}, songs, album_songs_${req.params.id}`,
		);
	}

	res.json({
		message: "✅ Thumbnail added",
		song: result[0],
	});
};

export const deleteAlbum = async (req: AuthenticatedRequest, res: any) => {
	if (req.user?.role !== "admin") {
		res.status(401).json({
			message: "❌ You are not admin",
		});
		return;
	}

	const { id } = req.params;

	const isAlbum = await sql`SELECT * FROM albums WHERE id = ${id}`;

	if (isAlbum.length === 0) {
		res.status(404).json({
			message: "❌ No album with this id",
		});
		return;
	}

	await sql`DELETE FROM albums WHERE id = ${id}`;

	//  Invalidate cache: albums, songs}
	if (redisClient.isReady) {
		await redisClient.del(`albums`); // ✅
		await redisClient.del(`songs`); // ✅
		// ⚠️ Because we will cascade (delete) all the songs of the deleted album,
		// we don't have to worry about individual song cache. Users won't be able to click on the individual songs.
		// ⚠️ But for future extension/learning purpose, we have to learn how the `non-cascade deletions` will be managed.
		// In scenario where an album deletion won't affect the individual songs. But `album-info` inside those songs
		// caches has to be removed, the caches must be invalidated.
		// Next update e eta implement korte hobe. Apatoto baad.
		// 👉 await redisClient.del(`song_${req.params.id}`);

		console.log(`🗑️ Cache invalidated: albums, songs`);
	}

	if (redisClient.isReady) {
		await redisClient.del(`albums`);
		console.log(`🗑️ Cache invalidated: for all albums`);
	}

	res.json({
		message: "✅ Album deleted successfully",
	});
};

export const deleteSong = async (req: AuthenticatedRequest, res: any) => {
	if (req.user?.role !== "admin") {
		res.status(401).json({
			message: "❌ You are not admin",
		});
		return;
	}

	const { id } = req.params;

	const song = await sql`SELECT * FROM songs WHERE id = ${id}`;

	if (song.length === 0) {
		res.status(404).json({
			message: "❌ No song with this id",
		});
		return;
	}

	await sql`DELETE FROM songs WHERE id = ${id}`;

	//  Invalidate cache: songs}
	if (redisClient.isReady) {
		await redisClient.del(`songs`);

		console.log(`🗑️ Cache invalidated: songs`);
	}

	res.json({
		message: "✅ Song deleted successfully",
	});
};
