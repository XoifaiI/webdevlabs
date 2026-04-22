"use strict";

import { unlink } from "node:fs/promises";
import logger from "../utils/logger.js";
import playlistStore from "../models/playlist-store.js";
import { v4 as uuidv4 } from "uuid";
import accounts from "./accounts.js";

const dashboard = {
  async createView(request, response, next) {
    try {
      const loggedInUser = await accounts.getCurrentUser(request);
      if (!loggedInUser) {
        response.redirect("/");
        return;
      }

      logger.info("Dashboard page loading!");
      await playlistStore.ensureReady();

      const searchTerm =
        typeof request.query.searchTerm === "string"
          ? request.query.searchTerm.trim().slice(0, 200)
          : "";

      const playlists = searchTerm
        ? playlistStore.searchPlaylist(searchTerm)
        : playlistStore.getAllPlaylists();

      const sortField = request.query.sort;
      const order = request.query.order === "desc" ? -1 : 1;

      let sorted = playlists;

      if (sortField === "title" || sortField === "rating") {
        sorted = playlists.slice().sort((a, b) => {
          if (sortField === "title") {
            return a.title.localeCompare(b.title) * order;
          }

          if (sortField === "rating") {
            return ((a.rating || 0) - (b.rating || 0)) * order;
          }

          return 0;
        });
      }

      const viewData = {
        title: "Playlist App Dashboard",
        playlists: sortField ? sorted : playlists,
        search: searchTerm,
        titleSelected: request.query.sort === "title",
        ratingSelected: request.query.sort === "rating",
        ascSelected: request.query.order === "asc",
        descSelected: request.query.order === "desc",
        fullname: `${loggedInUser.firstName} ${loggedInUser.lastName}`,
      };

      logger.debug(viewData.playlists);

      response.render("dashboard", viewData);
    } catch (err) {
      next(err);
    }
  },

  async addPlaylist(request, response, next) {
    const picture = request.files?.picture;
    try {
      const loggedInUser = await accounts.getCurrentUser(request);
      if (!loggedInUser) {
        response.redirect("/");
        return;
      }

      const title = typeof request.body.title === "string" ? request.body.title.trim() : "";
      const rating = parseInt(request.body.rating, 10);
      if (!title || !picture) {
        response.redirect("/dashboard");
        return;
      }
      const timestamp = new Date();
      const newPlayList = {
        id: uuidv4(),
        userid: loggedInUser.id,
        title: title,
        rating: Number.isInteger(rating) && rating >= 1 && rating <= 5 ? rating : 0,
        date: timestamp,
        songs: [],
      };
      await playlistStore.ensureReady();
      await playlistStore.addPlaylist(newPlayList, picture);
      response.redirect("/dashboard");
    } catch (err) {
      next(err);
    } finally {
      if (picture?.tempFilePath) {
        await unlink(picture.tempFilePath).catch(() => {});
      }
    }
  },

  async deletePlaylist(request, response, next) {
    try {
      const loggedInUser = await accounts.getCurrentUser(request);
      if (!loggedInUser) {
        response.redirect("/");
        return;
      }

      const playlistId = request.params.id;
      logger.debug(`Deleting Playlist ${playlistId}`);
      await playlistStore.ensureReady();
      await playlistStore.removePlaylist(playlistId);
      response.redirect("/dashboard");
    } catch (err) {
      next(err);
    }
  },
};

export default dashboard;
