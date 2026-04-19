import { sql } from "./index.js";

interface reqType extends Request {
	params?: any;
}

export const getAllAlbums = async (req: reqType, res: any) => {
	try {
		let albums;

		albums = await sql`SELECT * FROM albums`;

		res.status(200).json({ albums: albums });
		return;
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
	}
};

export const getAllSongs = async (req: reqType, res: any) => {
	try {
		let songs;

		songs = await sql`SELECT * FROM songs`;

		res.status(200).json({ songs: songs });
		return;
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
	}
};

export const getAllSongsOfAlbum = async (req: reqType, res: any) => {
	try {
		const { id } = req.params;

		let songDetail;

		songDetail = await sql`
		SELECT albums.title as album_title, albums.description as album_desc, songs.* 
		from albums left join songs on albums.id = songs.album_id
		where albums.id = ${id}`;

		if (songDetail.length === 0) {
			return res.status(404).json({ message: "Album not found" });
		}

		console.log(songDetail);

		return res.status(200).json({ allSongsOfAlbum: songDetail });
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
	}
};

export const getSingleSong = async (req: reqType, res: any) => {
	try {
		const song = await sql`SELECT * FROM songs WHERE id = ${req.params.id}`;

		console.log(song);

		res.status(200).json({ song: song[0] });
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
	}
};
