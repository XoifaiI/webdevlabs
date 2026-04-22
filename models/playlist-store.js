"use strict";

import JsonStore from "./json-store.js";
import Fuse from "fuse.js";
import logger from "../utils/logger.js";

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

  async addPlaylist(playlist, file) {
    try {
      playlist.picture = await this.store.addToCloudinary(file);
      await this.store.addCollection(this.collection, playlist);
    } catch (error) {
      logger.error("Error processing playlist:", error);
      throw error;
    }
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
    if (!playlist) return;

    if (playlist.picture && playlist.picture.public_id) {
      try {
        await this.store.deleteFromCloudinary(playlist.picture.public_id);
        logger.info("Cloudinary image deleted");
      } catch (err) {
        logger.error("Failed to delete Cloudinary image:", err);
      }
    }

    await this.store.removeCollection(this.collection, playlist);
  },
};

export default playlistStore;
