"use strict";

import JsonStore from "./json-store.js";

const playlistStore = {
  store: new JsonStore("./models/playlist-store.json", { playlistCollection: [] }),
  collection: "playlistCollection",
  array: "songs",

  async ensureReady() {
    await this.store.ensureReady();
  },

  getAllPlaylists() {
    return this.store.findAll(this.collection);
  },

  getPlaylist(id) {
    return this.store.findOneBy(this.collection, (playlist) => playlist.id === id);
  },
};

export default playlistStore;
