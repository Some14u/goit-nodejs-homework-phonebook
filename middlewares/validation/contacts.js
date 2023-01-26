const Joi = require("joi");

const patterns = {
  phone: /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
  consecutiveSpaces: /\s+/g,
};

const validationBase = Joi.object({
  id: Joi.number() // id
    .integer()
    .positive()
    .label("id"),
  name: Joi.string() // name
    .trim()
    .replace(patterns.consecutiveSpaces, " ")
    .label("name"),
  email: Joi.string() // email
    .trim()
    .email()
    .label("email"),
  phone: Joi.string() // phone
    .trim()
    .replace(patterns.consecutiveSpaces, " ")
    .regex(patterns.phone, { name: "required" })
    .label("phone"),
});

const validations = {

}

/** @typedef {import("express").RequestHandler} RequestHandler */

/**
 *
 * @type {RequestHandler}
 */
function validationHandler(req, res, next) {

}

module.exports = validationHandler;
