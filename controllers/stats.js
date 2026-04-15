"use strict";

import logger from "../utils/logger.js";
import playlistStore from "../models/playlist-store.js";
import userModel from "../models/user-store.js";
import accounts from "./accounts.js";

const stats = {
  async createView(request, response, next) {
    try {
      const loggedInUser = await accounts.getCurrentUser(request);
      if (!loggedInUser) {
        response.redirect("/");
        return;
      }

      logger.info("Stats page loading!");
      await playlistStore.ensureReady();

      const playlists = playlistStore.getAllPlaylists();

      let numPlaylists = playlists.length;

      let numSongs = playlists.reduce(
        (total, playlist) => total + (Array.isArray(playlist.songs) ? playlist.songs.length : 0),
        0,
      );

      let average = numPlaylists > 0 ? (numSongs / numPlaylists).toFixed(2) : 0;

      let totalRating = playlists.reduce(
        (total, playlist) => total + (parseInt(playlist.rating, 10) || 0),
        0,
      );
      let avgRating = numPlaylists > 0 ? totalRating / numPlaylists : 0;

      let ratings = playlists.map((playlist) => parseInt(playlist.rating, 10) || 0);
      let maxRating = ratings.length > 0 ? Math.max(...ratings) : 0;
      let maxRated = playlists.filter((playlist) => (parseInt(playlist.rating, 10) || 0) === maxRating);
      let favTitles = maxRated.map((item) => item.title);

      let songCounts = playlists.map((playlist) =>
        Array.isArray(playlist.songs) ? playlist.songs.length : 0,
      );
      let maxSongs = songCounts.length > 0 ? Math.max(...songCounts) : 0;
      let mostSongsPlaylists = playlists
        .filter((playlist) => (Array.isArray(playlist.songs) ? playlist.songs.length : 0) === maxSongs)
        .map((item) => item.title);

      await userModel.ensureReady();
      let numUsers = userModel.getUserCount();

      const statistics = {
        displayNumPlaylists: numPlaylists,
        displayNumSongs: numSongs,
        displayAverage: average,
        displayAvgRating: avgRating.toFixed(2),
        highest: maxRating,
        displayFav: favTitles,
        displayMaxSongs: maxSongs,
        displayMostSongsPlaylists: mostSongsPlaylists,
        displayNumUsers: numUsers,
      };

      const viewData = {
        title: "Playlist App Statistics",
        stats: statistics,
        fullname: `${loggedInUser.firstName} ${loggedInUser.lastName}`,
      };

      response.render("stats", viewData);
    } catch (err) {
      next(err);
    }
  },
};

export default stats;
