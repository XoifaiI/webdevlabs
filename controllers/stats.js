"use strict";

import logger from "../utils/logger.js";
import playlistStore from "../models/playlist-store.js";

const stats = {
  async createView(request, response, next) {
    try {
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

      const statistics = {
        displayNumPlaylists: numPlaylists,
        displayNumSongs: numSongs,
        displayAverage: average,
        displayAvgRating: avgRating.toFixed(2),
        highest: maxRating,
        displayFav: favTitles,
        displayMaxSongs: maxSongs,
        displayMostSongsPlaylists: mostSongsPlaylists,
      };

      const viewData = {
        title: "Playlist App Statistics",
        stats: statistics,
      };

      response.render("stats", viewData);
    } catch (err) {
      next(err);
    }
  },
};

export default stats;
