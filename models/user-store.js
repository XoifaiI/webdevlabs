"use strict";

import { timingSafeEqual } from "crypto";
import { argon2id } from "@noble/hashes/argon2.js";
import { randomBytes, utf8ToBytes, bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
import JsonStore from "./json-store.js";

const userStore = new JsonStore("./models/user-store.json", { users: [] });

const ARGON2_PARAMS = { t: 3, m: 65536, p: 1 };
const SALT_LENGTH = 16;
const HASH_LENGTH = 32;

function hashPassword(password) {
  const salt = randomBytes(SALT_LENGTH);
  const hash = argon2id(utf8ToBytes(password), salt, { ...ARGON2_PARAMS, dkLen: HASH_LENGTH });
  return `${bytesToHex(salt)}:${bytesToHex(hash)}`;
}

function verifyPassword(password, stored) {
  const [saltHex, hashHex] = stored.split(":");
  const salt = hexToBytes(saltHex);
  const candidate = argon2id(utf8ToBytes(password), salt, { ...ARGON2_PARAMS, dkLen: HASH_LENGTH });
  const expected = hexToBytes(hashHex);
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(candidate), Buffer.from(expected));
}

const userModel = {
  async ensureReady() {
    await userStore.ensureReady();
  },

  getUserCount() {
    return userStore.findAll("users").length;
  },

  getUserByEmail(email) {
    return userStore.findOneBy("users", (u) => u.email === email);
  },

  async addUser(user) {
    user.password = hashPassword(user.password);
    await userStore.addCollection("users", user);
  },

  authenticate(email, password) {
    const user = this.getUserByEmail(email);
    if (!user) return null;
    if (!verifyPassword(password, user.password)) return null;
    return user;
  },
};

export default userModel;
