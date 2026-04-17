import express from "express";
import uploadFile, { isAuth } from "./middleware.js";
import { addAlbum, addSong, addThumbnail, deleteSong } from "./controller.js";

const router = express.Router();

router.post("/album/new", isAuth, uploadFile, addAlbum);
router.post("/song/new", isAuth, uploadFile, addSong);
router.post("/song/:id", isAuth, uploadFile, addThumbnail);
router.delete("/song/:id", isAuth, deleteSong);

export default router;
