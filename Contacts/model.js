const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const { messages } = require("../helpers");

/**
 * @typedef {{id: Number, name: String, email:String, phone: String}} ContactParams
 */

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
    .label("name")
    .required(),
  email: Joi.string() // email
    .trim()
    .email()
    .label("email")
    .required(),
  phone: Joi.string() // phone
    .trim()
    .replace(patterns.consecutiveSpaces, " ")
    .regex(patterns.phone, { name: "required" })
    .label("phone")
    .required(),
  favorite: Joi.boolean(), // favorite
};

/**
 * Validates object with fields by using {@link Contact.validators|validators}.
 * The values of the object may change after validation due to possible normalization.
 *
 * It considers only those fields that were given, **plus** the ones from **forceRequiredList** parameter
 * @param {ContactParams} fields an object with raw fields to validate
 * @param {[string]|"all"} [forceRequiredList] an array of keys, which are required to be present. Could also be "all".
 * @throws corresponding validation error using {@link ErrorWithStatusCode}
 */
function validateJoi(fields, forceRequiredList = []) {
  if (forceRequiredList === "all") forceRequiredList = Object.keys(validators);
  const listToValidate = [...Object.keys(fields), ...forceRequiredList];
  for (const key of listToValidate) {
    const required = forceRequiredList?.includes(key);
    const value = Joi.attempt(
      fields[key],
      validators[key],
      required && { presence: "required" }
    );
    if (typeof value !== "undefined") fields[key] = value;
  }
}

/**
 * Tests names for equality by splitting them to words, and then testing
 * for symmetric dirrefence of those two word sets.
 *
 * Basically, it works in the way that "Bob Ross" and "ROSS bob" considered equal.
 *
 * The test is case insensitive.
 * @param {string} name a name to be filtered with
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
    statics: { validateJoi, filterByNameQuery },
    versionKey: false,
  }
);

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
