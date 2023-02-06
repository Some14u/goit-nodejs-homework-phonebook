/** @typedef {import("../models/user.model").UserType} UserType */
const { NotFoundError } = require("../helpers/errors");
const api = require("../models/user.model");

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
   * Updates user fields.
   * @param {ObjectId} id id of the user to be updated
   * @param param object with fields and values to update
   * @returns {Promise<UserType>}
   * @throws {NotFoundError|ExistError}
   */
  updateById(id, param) {
    return api
      .findByIdAndUpdate(id, param, { new: true })
      .orFail(new NotFoundError());
  }
}

module.exports = UserService;
