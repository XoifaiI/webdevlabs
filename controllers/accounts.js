"use strict";

import { v4 as uuidv4 } from "uuid";
import logger from "../utils/logger.js";
import userModel from "../models/user-store.js";

const accounts = {
  async index(request, response) {
    response.render("index", { title: "Welcome" });
  },

  async signup(request, response) {
    response.render("signup", { title: "Signup" });
  },

  async login(request, response) {
    response.render("login", { title: "Login" });
  },

  async register(request, response) {
    await userModel.ensureReady();

    const firstName = typeof request.body.firstName === "string" ? request.body.firstName.trim().slice(0, 100) : "";
    const lastName = typeof request.body.lastName === "string" ? request.body.lastName.trim().slice(0, 100) : "";
    const email = typeof request.body.email === "string" ? request.body.email.trim().toLowerCase().slice(0, 254) : "";
    const password = typeof request.body.password === "string" ? request.body.password : "";

    if (!firstName || !lastName || !email || password.length < 8) {
      response.redirect("/signup");
      return;
    }

    if (userModel.getUserByEmail(email)) {
      response.redirect("/signup");
      return;
    }

    const user = {
      id: uuidv4(),
      firstName,
      lastName,
      email,
      password,
    };
    await userModel.addUser(user);
    logger.info("New user registered");
    response.cookie("playlist-user", email, { httpOnly: true, sameSite: "strict", signed: true });
    response.redirect("/dashboard");
  },

  async authenticate(request, response) {
    await userModel.ensureReady();

    const email = typeof request.body.email === "string" ? request.body.email.trim().toLowerCase() : "";
    const password = typeof request.body.password === "string" ? request.body.password : "";

    const user = userModel.authenticate(email, password);
    if (user) {
      response.cookie("playlist-user", user.email, { httpOnly: true, sameSite: "strict", signed: true });
      logger.info("User logged in");
      response.redirect("/dashboard");
    } else {
      response.redirect("/login");
    }
  },

  async logout(request, response) {
    response.clearCookie("playlist-user", { httpOnly: true, sameSite: "strict", signed: true });
    response.redirect("/");
  },

  async getCurrentUser(request) {
    const email = request.signedCookies["playlist-user"];
    if (!email) return null;
    await userModel.ensureReady();
    return userModel.getUserByEmail(email);
  },
};

export default accounts;
