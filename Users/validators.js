/** @typedef {import("express").RequestHandler} RequestHandler */
const User = require("./model");

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

module.exports = {
  credentialsValidator,
};
