"use strict";

import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

class JsonStore {
  #ready;

  constructor(file, defaults) {
    this.db = new Low(new JSONFile(file), defaults);
    this.#ready = this.db.read();
  }

  async ensureReady() {
    await this.#ready;
  }

  findAll(collection) {
    return this.db.data[collection];
  }

  findBy(collection, filter) {
    return this.db.data[collection].filter(filter);
  }

  findOneBy(collection, filter) {
    return this.db.data[collection].filter(filter)[0];
  }

  async addCollection(collection, obj) {
    this.db.data[collection].push(obj);
    await this.db.write();
  }

  async addItem(collection, id, arr, obj) {
    const data = this.db.data[collection].filter((c) => c.id === id);
    if (!data.length)
      throw new Error(`Item with id "${id}" not found in "${collection}"`);
    data[0][arr].push(obj);
    await this.db.write();
  }

  async removeCollection(collection, obj) {
    const index = this.db.data[collection].indexOf(obj);
    if (index > -1) {
      this.db.data[collection].splice(index, 1);
    }
    await this.db.write();
  }

  async removeItem(collection, id, arr, itemId) {
    const data = this.db.data[collection].filter((c) => c.id === id);
    if (!data.length)
      throw new Error(`Item with id "${id}" not found in "${collection}"`);
    const item = data[0][arr].filter((i) => i.id === itemId);
    if (!item.length)
      throw new Error(`Nested item with id "${itemId}" not found in "${arr}"`);
    const index = data[0][arr].indexOf(item[0]);
    if (index > -1) {
      data[0][arr].splice(index, 1);
    }
    await this.db.write();
  }

  async editCollection(collection, id, obj) {
    const index = this.db.data[collection].findIndex((c) => c.id === id);
    if (index > -1) {
      this.db.data[collection].splice(index, 1, obj);
    }
    await this.db.write();
  }

  async editItem(collection, id, itemId, arr, obj) {
    const data = this.db.data[collection].filter((c) => c.id === id);
    if (!data.length)
      throw new Error(`Item with id "${id}" not found in "${collection}"`);
    const index = data[0][arr].findIndex((i) => i.id === itemId);
    if (index < 0)
      throw new Error(`Nested item with id "${itemId}" not found in "${arr}"`);
    data[0][arr].splice(index, 1, obj);
    await this.db.write();
  }
}

export default JsonStore;
