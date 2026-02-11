"use strict";

import logger from "../utils/logger.js";
import aboutStore from "../models/about-store.js";

const about = {
  async aboutView(request, response, next) {
    try {
      logger.info("About page loading!");
      await aboutStore.ensureReady();

      const viewData = {
        title: "About the Playlist App",
        employee: aboutStore.getAppInfo(),
      };

      response.render("about", viewData);
    } catch (err) {
      next(err);
    }
  },
};

export default about;
