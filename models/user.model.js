/**
 * @typedef {import("mongoose").InferSchemaType<typeof userSchema>} UserType
 * @typedef {"starter"|"pro"|"business"} SubscriptionTypes
 *
 * @typedef {mongoose.Document<unknown, any, UserType> & UserType} MiddlewareThisType
 */

const mongoose = require("mongoose");
const mongoDb = require("mongodb");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const crypt = require("../repositories/hash.repo");
const avatar = require("../repositories/avatar.repo");

const messages = require("../helpers/messages");
const { createJoiValidator } = require("../repositories/validation.repo");
const { ExistError } = require("../helpers/errors");

/** @enum {SubscriptionTypes} */
const subscriptionTypes = {
  starter: "starter",
  pro: "pro",
  business: "business",
};

/** @type {SubscriptionTypes} */
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

/**
 * Error handler that alters the "duplicate email" error
 * @type {mongoose.ErrorHandlingMiddlewareFunction}
 */
function interceptErrors(err, _, next) {
  if (
    err.constructor.name === mongoDb.MongoServerError.name &&
    err.code === 11000
  ) {
    next(new ExistError(messages.users.emailInUse));
  } else {
    next();
  }
}

/**
 * Middleware that takes care of asyncronously obfuscation
 *
 * Currently I do it for password and email verification token which is basically a jwt.
 * It is necessary to reobfuscate jwt (which is already hashed itself) for security reasons.
 * @type {mongoose.PreSaveMiddlewareFunction}
 * @this {MiddlewareThisType}
 */
async function preSaveHandler() {
  if (this.isModified("password")) {
    this.password = await crypt.apply(this.password);
  }
  if (this.isModified("verificationToken")) {
    this.verificationToken = await crypt.apply(this.verificationToken);
  }
}

/**
 * Compares given password with current user password in the model
 * @param {string} password a password to comare
 */
function comparePassword(password) {
  return crypt.compare(password, this.password);
}

/**
 * Compares given email verification token with current user token in the model
 * @param {string} jwt a password to comare
 */
function compareVerificationToken(token) {
  return crypt.compare(token, this.verificationToken);
}

const userSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: [true, messages.users.mongoPasswordRequired], // Should never happen, as I understand the logic
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, messages.users.mongoEmailRequired], // Should never happen, as I understand the logic
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
    avatarURL: {
      type: String,
      default: function ({ email }) {
        return avatar.getUrlByEmail(email);
      },
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, messages.users.noVerifyToken],
    },
  },
  {
    statics: {
      validateJoi: createJoiValidator(validators),
      SubscriptionTypes: subscriptionTypes,
    },
    methods: {
      comparePassword,
      compareVerificationToken,
    },
    versionKey: false,
  }
);

// Attach an error handling middleware
userSchema.post("save", interceptErrors);
// Attach a password obfuscating middleware
userSchema.pre("save", preSaveHandler);

const User = mongoose.model("User", userSchema);

module.exports = User;
