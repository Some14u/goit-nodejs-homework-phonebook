/** @typedef {import("express").RequestHandler} RequestHandler */
const Contact = require("./model");
const messages = require("../helpers/messages");
const { ValidationError } = require("../helpers/errors");

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
 * This special case validator is required according to task rules.
 * It works flawlessly without it, because anyway the check will be made
 * by the following next Joi validation
 */
function putMissingFieldsValidator(req, _, next) {
  const { name, email, phone } = req.body;
  if (!name && !email && !phone) throw new ValidationError(messages.missingFields);
  next();
}

/**
 * Validator for favorite fields
 * @type {RequestHandler}
 */
function favoriteValidator({ body }, _, next) {
  // If user sends a simple "true"/"false", it will end up as the first
  // and the only key in the request body
  const bodyKeys = Object.keys(body);
  if (!body.favorite && bodyKeys.length === 1) body.favorite = bodyKeys[0];
  // This check is here because of task requirements.
  if (!body.favorite) throw new ValidationError(messages.missingFavorite);
  // This basically does the same but with joi builtin error message
  Contact.validateJoi(body, {
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
