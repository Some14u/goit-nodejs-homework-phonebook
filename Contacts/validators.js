/** @typedef {import("express").RequestHandler} RequestHandler */
const Contact = require("./model");
const messages = require("../helpers/messages");
const { MissingFieldsError } = require("../helpers/errors");

/**
 * Id validator
 * @type {RequestHandler}
 */
function idValidator(req, _, next) {
  Contact.validateJoi(req.params, {
    process: ["id"],
    required: ["id"],
  });
  next();
}

/**
 * Validator for push/put
 * @type {RequestHandler}
 */
function contactValidator(req, _, next) {
  Contact.validateJoi(req.body, {
    process: ["name", "email", "phone", "favorite"],
    required: ["name", "email", "phone"],
  });
  next();
}

/**
 * This stupid special case validator is required by the task rules.
 * It works flawlessly without it, simply throwing an error if any field is missing
 */
function putMissingFieldsValidator(req, _, next) {
  const { name, email, phone } = req.body;
  if (!name && !email && !phone) throw new MissingFieldsError();
  next();
}

/**
 * Validator for favorite fields
 * @type {RequestHandler}
 */
function favoriteValidator(req, _, next) {
  // This check is here because of task requirements.
  if (!req.body.favorite)
    throw new MissingFieldsError(messages.missingFavorite);
  // This basically does the same but with joi builtin error message
  Contact.validateJoi(req.body, {
    process: ["favorite"],
    required: ["favorite"],
  });
  next();
}

module.exports = {
  idValidator,
  contactValidator,
  putMissingFieldsValidator,
  favoriteValidator,
};
