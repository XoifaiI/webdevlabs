"use strict";

import logger from "../utils/logger.js";
import empStore from "../models/emp-store.js";
import accounts from "./accounts.js";

const about = {
  async createView(request, response, next) {
    try {
      const loggedInUser = await accounts.getCurrentUser(request);
      if (!loggedInUser) {
        response.redirect("/");
        return;
      }

      logger.info("About page loading!");
      await empStore.ensureReady();

      const viewData = {
        title: "Playlist App About",
        emps: empStore.getEmpInfo(),
        fullname: `${loggedInUser.firstName} ${loggedInUser.lastName}`,
      };

      logger.debug(viewData.emps);
      response.render("about", viewData);
    } catch (err) {
      next(err);
    }
  },
};

export default about;
