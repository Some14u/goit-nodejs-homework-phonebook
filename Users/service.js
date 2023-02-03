const { ExistError, NotFoundError } = require("../helpers/errors");
const request = require("../requestContext");
const User = require("./model");

/**
 * Searches a user matching email
 * @param {string} email an email of cuser to be returned
 * @returns {Object} the user
 */
async function getByEmailOrThrow(email) {
  return await User.findOne({ email }).orFail(new NotFoundError());
}

/**
 * Adds a new user using data, provided
 * Checks the database for anoter user with the same name.
 * @param params an object, containing **email** and **password** fields
 * (**subscription** and **token** are optional).
 */
async function addOrThrow(params) {
  return await User.create(params);
}

/**
 * Updates existing user subscription value.
 * @param {Number} id id of contact to be updated
 * @param {Object} param
 * @param {User.subscriptionTypes} param.subscription a new value
 * @returns {Object} the user
 */
async function updateUserSubscription(id, { subscription }) {
  return await User.findByIdAndUpdate(
    id,
    { subscription },
    { new: true }
  ).orFail(new NotFoundError());
}

function getUserId() {
  return request.context.value;
}

function setUserId(id) {
  request.context.value = id;
}

module.exports = {
  getByEmailOrThrow,
  addOrThrow,
  getUserId,
  setUserId,
};
