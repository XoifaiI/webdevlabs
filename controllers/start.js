"use strict";

import logger from "../utils/logger.js";
import appStore from "../models/app-store.js";
import accounts from "./accounts.js";

const start = {
  async createView(request, response, next) {
    try {
      const loggedInUser = await accounts.getCurrentUser(request);
      if (!loggedInUser) {
        response.redirect("/");
        return;
      }

      logger.info("Start page loading!");
      await appStore.ensureReady();

      const viewData = {
        title: "Welcome to the Playlist app!",
        info: appStore.getAppInfo(),
        fullname: `${loggedInUser.firstName} ${loggedInUser.lastName}`,
      };

      response.render("start", viewData);
    } catch (err) {
      next(err);
    }
  },
};

export default start;
