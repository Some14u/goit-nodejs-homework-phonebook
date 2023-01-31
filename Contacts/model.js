const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const messages = require("../helpers/messages");
const { createJoiValidator } = require("../helpers/validation");

const patterns = {
  phone: /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
  consecutiveSpaces: /\s+/g,
};

/** @type {Object.<string, Joi>} */
const validators = {
  id: Joi.objectId() // id
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
  favorite: Joi.boolean() // favorite
    .label("favorite"),
};

/**
 * A mongoose query filter, which tests names for equality by splitting them to words
 * and then testing for symmetric difference of those two word sets.
 *
 * The test is case insensitive.
 *
 * Basically, it works in the way that "Bob Ross" and "ROSS bob" considered equal.
 * @param {string} name a name to filter with
 * @returns {mongoose.FilterQuery} a {@link mongoose.FilterQuery|mongoose filter query} to match the name.
 */
function filterByNameQuery(name) {
  const nameParts = name.toLocaleLowerCase().split(" ");
  return {
    $expr: {
      $setEquals: [nameParts, { $split: [{ $toLower: "$name" }, " "] }],
    },
  };
}

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, messages.mongooseNoName], // Should never happen, as I understand the logic
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    statics: { validateJoi: createJoiValidator(validators), filterByNameQuery },
    versionKey: false,
  }
);

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
