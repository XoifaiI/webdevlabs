"use strict";

import express from "express";
import fileUpload from "express-fileupload";
const router = express.Router();

import accounts from "./controllers/accounts.js";
import start from "./controllers/start.js";
import dashboard from "./controllers/dashboard.js";
import about from "./controllers/about.js";
import playlist from "./controllers/playlist.js";
import stats from "./controllers/stats.js";

const upload = fileUpload({ useTempFiles: true });

router.get("/", accounts.index);
router.get("/login", accounts.login);
router.get("/signup", accounts.signup);
router.get("/logout", accounts.logout);
router.post("/register", accounts.register);
router.post("/authenticate", accounts.authenticate);
router.get("/start", start.createView);
router.get("/dashboard", dashboard.createView);
router.get("/about", about.createView);
router.get("/stats", stats.createView);
router.get("/searchCategory", dashboard.createView);
router.get("/sortData", dashboard.createView);
router.get("/playlist/:id", playlist.createView);
router.post("/playlist/:id/addsong", playlist.addSong);
router.post("/playlist/:id/deletesong/:songid", playlist.deleteSong);
router.post("/playlist/:id/updatesong/:songid", playlist.updateSong);
router.post("/dashboard/addplaylist", upload, dashboard.addPlaylist);
router.post("/dashboard/deleteplaylist/:id", dashboard.deletePlaylist);

router.get("/error", (request, response) => response.status(404).end("Page not found."));

export default router;
