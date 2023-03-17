/** @typedef {import("mongoose").InferSchemaType<contactSchema>} ContactType */
const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const messages = require("../helpers/messages");
const { createJoiValidator } = require("../repositories/validation.repo");

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
    .case("lower")
    .email()
    .label("email"),
  phone: Joi.string() // phone
    .trim()
    .replace(patterns.consecutiveSpaces, " ")
    .regex(patterns.phone, { name: "required" })
    .label("phone"),
  favorite: Joi.boolean() // favorite
    .label("favorite"),
  // No owner here because we never need to pass it
};

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, messages.contacts.mongoNoName], // Should never happen, as I understand the logic
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
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      select: false, // Exclude from output
    },
  },
  {
    statics: { validateJoi: createJoiValidator(validators) },
    versionKey: false,
  }
);

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
