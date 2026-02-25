"use strict";

import logger from "../utils/logger.js";
import playlistStore from "../models/playlist-store.js";

const playlist = {
  async createView(request, response, next) {
    try {
      const playlistId = request.params.id;
      logger.debug(`Playlist id = ${playlistId}`);
      await playlistStore.ensureReady();

      const viewData = {
        title: "Playlist",
        singlePlaylist: playlistStore.getPlaylist(playlistId),
      };

      response.render("playlist", viewData);
    } catch (err) {
      next(err);
    }
  },
};

export default playlist;
