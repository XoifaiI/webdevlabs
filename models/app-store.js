"use strict";

import JsonStore from "./json-store.js";

const appStore = {
  store: new JsonStore("./models/app-store.json", { info: {} }),
  collection: "info",
  array: "creators",

  async ensureReady() {
    await this.store.ensureReady();
  },

  getAppInfo() {
    return this.store.findAll(this.collection);
  },
};

export default appStore;
