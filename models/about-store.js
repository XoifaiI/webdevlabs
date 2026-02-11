"use strict";

import JsonStore from "./json-store.js";

const aboutStore = {
  store: new JsonStore("./models/about-store.json", { employee: {} }),
  collection: "employee",

  async ensureReady() {
    await this.store.ensureReady();
  },

  getAppInfo() {
    return this.store.findAll(this.collection);
  },
};

export default aboutStore;
