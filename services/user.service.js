/** @typedef {import("../models/user.model").UserType} UserType */
const { NotFoundError, UnauthorizedError } = require("../helpers/errors");
const api = require("../models/user.model");
const { URL } = require("url");
const path = require("path");
const settings = require("../helpers/settings");
const avatar = require("../helpers/avatar");
const messages = require("../helpers/messages");
const { filterObj } = require("../helpers/tools");
const util = require("util");
const jwt = require("jsonwebtoken");

const signAsync = util.promisify(jwt.sign); // Promisified version of jwt.sign

class UserService {
  /**
   * Searches a user matching email
   * @param {string} email an email of cuser to be returned
   * @throws {NotFoundError}
   * @returns {Promise<UserType>}
   */
  getByEmail(email) {
    return api.findOne({ email }).orFail(new NotFoundError());
  }

  /**
   * Searches a user matching id
   * @param {ObjectId} id id of the user to search
   * @throws {NotFoundError}
   * @returns {Promise<UserType>}
   */
  getById(id) {
    return api.findById(id).orFail(new NotFoundError());
  }

  /**
   * Adds a new user using data, provided in **params**.
   * Checks the database for anoter user with the same name.
   * @param params an object, containing **email** and **password** fields
   * (**subscription** and **token** are optional).
   * @returns {Promise<UserType>}
   * @throws {ExistError} Note, that this error is actually thrown by interceptErrors middleware
   * in [User model module](../models/user.model.js).
   */
  add(params) {
    return api.create(params);
  }

  /**
   * Logins user using credentials
   *
   * Returns user with new token assigned
   * @param {string} email user email
   * @param {string} password user password
   * @return {Promise<UserType>}
   */
  async login(email, password) {
    let user = await this.getByEmail(email);

    const passwordsAreEqual = await user.comparePassword(password);
    if (!passwordsAreEqual) {
      throw new UnauthorizedError(messages.users.loginError);
    }

    const payload = filterObj(user, [
      ["_id", "id"],
      "email",
      "subscription",
      "avatarURL",
    ]);

    const token = await signAsync(payload, settings.authentication.jwtSecret, {
      expiresIn: settings.authentication.jwtLifetime,
    });

    user = await this.updateById(user.id, { token });
    return user;
  }

  /**
   * Updates user fields
   * @param {ObjectId} id id of the user to be updated
   * @param param object with fields and values to update
   * @returns {Promise<UserType>}
   * @throws {NotFoundError|ExistError} could possibly throw ExistError if you're updating the email field and the database already has it.
   */
  updateById(id, param) {
    return api
      .findByIdAndUpdate(id, param, { new: true })
      .orFail(new NotFoundError());
  }

  /**
   * Updates user fields
   * @param {ObjectId} id id of the user to be updated
   * @param {string} source a full path (with name) to the file to process with
   * @returns {Promise<string>}
   * @throws {NotFoundError}
   */
  async updateAvatarById(id, source) {
    // Setup paths
    const parsedPath = path.parse(source);
    const relative = path.join(settings.avatar.folder, parsedPath.base);
    const avatarURL = new URL("file:" + relative).pathname;
    const destination = path.resolve(settings.folders.public, relative);

    // Move the image to the public folder and wipe out from tmp
    await avatar.resizeAndMove(source, destination, settings.avatar.size);

    // Update the user avatarURL with new value
    // I'm using api expicitly because i need the old avatar url
    const { avatarURL: oldAvatarURL } = await api
      .findByIdAndUpdate(id, { avatarURL })
      .orFail(new NotFoundError());

    // Delete the old avatar if it exists
    await avatar.deleteByUrl(oldAvatarURL);

    return avatarURL;
  }
}

module.exports = UserService;
