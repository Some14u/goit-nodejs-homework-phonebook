const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const messages = require("../helpers/messages");
const { createJoiValidator } = require("../helpers/validation");

const subscriptionTypes = {
  starter: "starter",
  pro: "pro",
  business: "business",
};

const defaultSubscription = subscriptionTypes.starter;

/** @type {Object.<string, Joi>} */
const validators = {
  password: Joi.string() // name
    .trim()
    .alphanum()
    .min(8)
    .max(100)
    .label("password"),
  email: Joi.string() // email
    .trim()
    .case("lower")
    .email()
    .max(100) // This to prevent excessive token size, which contains email as payload
    .label("email"),
  subscription: Joi.string() // subscription
    .trim()
    .case("lower")
    .valid(...Object.values(subscriptionTypes))
    .default(defaultSubscription)
    .label("subscription"),
};

const userSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: [true, messages.users.passwordRequired], // Should never happen, as I understand the logic
    },
    email: {
      type: String,
      required: [true, messages.users.emailRequired], // Should never happen, as I understand the logic
      unique: true,
    },
    subscription: {
      type: String,
      enum: Object.values(subscriptionTypes),
      default: defaultSubscription,
    },
    token: {
      type: String,
      default: null,
    },
  },
  {
    statics: { validateJoi: createJoiValidator(validators), subscriptionTypes },
    versionKey: false,
  }
);

const Contact = mongoose.model("User", userSchema);

module.exports = Contact;
