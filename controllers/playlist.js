"use strict";

import logger from "../utils/logger.js";
import playlistStore from "../models/playlist-store.js";
import { v4 as uuidv4 } from "uuid";
import accounts from "./accounts.js";

const playlist = {
  async createView(request, response, next) {
    try {
      const loggedInUser = await accounts.getCurrentUser(request);
      if (!loggedInUser) {
        response.redirect("/");
        return;
      }

      const playlistId = request.params.id;
      logger.debug(`Playlist id = ${playlistId}`);
      await playlistStore.ensureReady();

      const viewData = {
        title: "Playlist",
        singlePlaylist: playlistStore.getPlaylist(playlistId),
        fullname: `${loggedInUser.firstName} ${loggedInUser.lastName}`,
      };

      response.render("playlist", viewData);
    } catch (err) {
      next(err);
    }
  },

  async addSong(request, response, next) {
    try {
      const loggedInUser = await accounts.getCurrentUser(request);
      if (!loggedInUser) {
        response.redirect("/");
        return;
      }

      const playlistId = request.params.id;
      const title = typeof request.body.title === "string" ? request.body.title.trim() : "";
      const artist = typeof request.body.artist === "string" ? request.body.artist.trim() : "";
      if (!title || !artist) {
        response.redirect("/playlist/" + encodeURIComponent(playlistId));
        return;
      }
      await playlistStore.ensureReady();
      const newSong = {
        id: uuidv4(),
        title: title,
        artist: artist,
      };
      await playlistStore.addSong(playlistId, newSong);
      response.redirect("/playlist/" + playlistId);
    } catch (err) {
      next(err);
    }
  },

  async deleteSong(request, response, next) {
    try {
      const loggedInUser = await accounts.getCurrentUser(request);
      if (!loggedInUser) {
        response.redirect("/");
        return;
      }

      const playlistId = request.params.id;
      const songId = request.params.songid;
      await playlistStore.ensureReady();
      await playlistStore.removeSong(playlistId, songId);
      response.redirect("/playlist/" + playlistId);
    } catch (err) {
      next(err);
    }
  },

  async updateSong(request, response, next) {
    try {
      const loggedInUser = await accounts.getCurrentUser(request);
      if (!loggedInUser) {
        response.redirect("/");
        return;
      }

      const playlistId = request.params.id;
      const songId = request.params.songid;
      const title = typeof request.body.title === "string" ? request.body.title.trim() : "";
      const artist = typeof request.body.artist === "string" ? request.body.artist.trim() : "";
      if (!title || !artist) {
        response.redirect("/playlist/" + encodeURIComponent(playlistId));
        return;
      }
      logger.debug("updating song " + songId);
      const updatedSong = {
        id: songId,
        title: title,
        artist: artist,
      };
      await playlistStore.ensureReady();
      await playlistStore.editSong(playlistId, songId, updatedSong);
      response.redirect("/playlist/" + playlistId);
    } catch (err) {
      next(err);
    }
  },
};

export default playlist;
