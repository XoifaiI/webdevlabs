"use strict";

import logger from "../utils/logger.js";
import appStore from "../models/app-store.js";

const start = {
  async createView(request, response, next) {
    try {
      logger.info("Start page loading!");
      await appStore.ensureReady();

      const viewData = {
        title: "Welcome to the Playlist app!",
        info: appStore.getAppInfo(),
      };

      response.render("start", viewData);
    } catch (err) {
      next(err);
    }
  },
};

export default start;
