"use strict";

import JsonStore from "./json-store.js";
import Fuse from "fuse.js";

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

  async addSong(id, song) {
    await this.store.addItem(this.collection, id, this.array, song);
  },

  async addPlaylist(playlist) {
    await this.store.addCollection(this.collection, playlist);
  },

  async removeSong(playlistId, songId) {
    await this.store.removeItem(this.collection, playlistId, this.array, songId);
  },

  async editSong(id, songId, updatedSong) {
    await this.store.editItem(this.collection, id, songId, this.array, updatedSong);
  },

  searchPlaylist(search) {
    const playlists = this.store.findAll(this.collection);
    const fuse = new Fuse(playlists, {
      keys: ["title"],
      threshold: 0.4,
      ignoreLocation: true,
    });
    return fuse.search(search).map((result) => result.item);
  },

  async removePlaylist(playlistId) {
    const playlist = this.getPlaylist(playlistId);
    if (playlist) {
      await this.store.removeCollection(this.collection, playlist);
    }
  },
};

export default playlistStore;
