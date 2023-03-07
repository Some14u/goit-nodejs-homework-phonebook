/** @typedef {import("../helpers/types").RequestHandler} RequestHandler */
const User = require("../models/user.model");

/**
 * Validator for signup/signin
 * @type {RequestHandler}
 */
function credentialsValidator(req, _, next) {
  User.validateJoi(req.body, {
    process: ["email", "password", "subscription"],
    require: ["email", "password"],
  });
  next();
}

/**
 * Validator for requestEmailVerificationToken
 * @type {RequestHandler}
 */
function emailValidator(req, _, next) {
  User.validateJoi(req.body, {
    process: ["email"],
    require: ["email"],
  });
  next();
}

/**
 * Validator for user subscription changing endpoint
 * @type {RequestHandler}
 */
function subscriptionValidator({ body }, _, next) {
  User.validateJoi(body, {
    process: ["subscription"],
    require: ["subscription"],
  });
  next();
}

module.exports = {
  credentialsValidator,
  emailValidator,
  subscriptionValidator,
};
