/** @typedef {import("../helpers/types").RequestHandler} RequestHandler */
const Contact = require("../models/contact.model");
const messages = require("../helpers/messages");
const { ValidationError } = require("../helpers/errors");
const { createJoiValidator } = require("../repositories/validation.repo");
const Joi = require("joi");

/**
 * Id validator
 * @type {RequestHandler}
 */
function idValidator(req, _, next) {
  Contact.validateJoi(req.params, {
    process: ["id"],
    require: ["id"],
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
    require: ["name", "email", "phone"],
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
  if (!name && !email && !phone)
    throw new ValidationError(messages.missingFields);
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
  if (!("favorite" in body) && bodyKeys.length === 1)
    body.favorite = bodyKeys[0];
  // This check is here because of task requirements.
  if (!("favorite" in body)) {
    throw new ValidationError(messages.contacts.missingFavorite);
  }
  // This basically does the same but with joi builtin error message
  Contact.validateJoi(body, {
    process: ["favorite"],
    require: ["favorite"],
  });
  next();
}

/**
 * Validator for getAll query parameters
 * @type {RequestHandler}
 */
function queryParamsValidation(req, _, next) {
  validateQueryParams(req.query);
  next();
}

const validateQueryParams = createJoiValidator({
  page: Joi.number().positive().integer().label("page"),
  limit: Joi.number().positive().integer().label("limit"),
  favorite: Joi.boolean().label("favorite"),
});

module.exports = {
  idValidator,
  contactValidator,
  putMissingFieldsValidator,
  favoriteValidator,
  queryParamsValidation,
};
