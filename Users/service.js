const { ExistError, NotFoundError } = require("../helpers/errors");
const request = require("../requestContext");
const User = require("./model");

/**
 * Searches a user matching email
 * @param {string} email an email of cuser to be returned
 */
async function getByEmail(email) {
  return await User.findOne({ email }).orFail(new NotFoundError());
}

/**
 * Adds a new user using data, provided
 * Checks the database for anoter user with the same name.
 * @param params an object, containing **email** and **password** fields
 * (**subscription** and **token** are optional).
 */
async function add(params) {
  return await User.create(params);
}

/**
 * Updates user fields.
 * @param {Number} email id of contact to be updated
 * @param {Object} param object with fields and values to update
 * @param {User.subscriptionTypes} param.subscription a new value
 */
async function updateByEmail(email, param) {
  return await User.findAndUpdate(
    { email },
    param,
    { new: true }
  ).orFail(new NotFoundError());
}

module.exports = {
  getByEmail,
  add,
  updateByEmail
};
