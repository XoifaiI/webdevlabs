"use strict";

import logger from "../utils/logger.js";
import empStore from "../models/emp-store.js";

const about = {
  async createView(request, response, next) {
    try {
      logger.info("About page loading!");
      await empStore.ensureReady();

      const viewData = {
        title: "Playlist App About",
        emps: empStore.getEmpInfo(),
      };

      logger.debug(viewData.emps);
      response.render("about", viewData);
    } catch (err) {
      next(err);
    }
  },
};

export default about;
