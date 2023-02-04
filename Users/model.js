const mongoose = require("mongoose");
const mongoDb = require("mongodb");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const bcrypt = require("bcrypt");

const messages = require("../helpers/messages");
const { createJoiValidator } = require("../helpers/validation");
const { ExistError, NotFoundError } = require("../helpers/errors");

/**
 * @typedef {{ password: string, email: string, subscription: string, token: string}} ThisType
 * @typedef {mongoose.Model<mongoose.FlatRecord<ThisType>, {}, {}, {}, any>} StaticsThisType
 * @typedef {mongoose.Document<unknown, any, ThisType> & ThisType} MiddlewareThisType
 *
 * @typedef {"starter"|"pro"|"business"} SubscriptionTypes
 * @enum {SubscriptionTypes}
 */
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
  if (err instanceof mongoDb.MongoServerError && err.code === 11000) {
    next(new ExistError(messages.users.emailInUse));
  } else {
    next();
  }
}

/**
 * Middleware that takes care of asyncronously password obfuscation.
 * @type {mongoose.PreSaveMiddlewareFunction}
 * @this {MiddlewareThisType}
 */
function preSaveHandler(next) {
  if (!this.isModified("password")) next();
  return bcrypt.hash(this.password, 8, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    next();
  });
}

/** @this {StaticsThisType} */
async function getByEmail(email) {
  return this.findOne({ email }).orFail(new NotFoundError());
}

/** @this {StaticsThisType} */
async function updateByEmail(email, properties) {
  return await this.findOneAndUpdate(
    { email }, //
    properties,
    { new: true }
  ).orFail(new NotFoundError());
}

async function comparePassword(password) {
  return await bcrypt.compare(password, this.password);
}

const userSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: [true, messages.users.passwordRequired], // Should never happen, as I understand the logic
    },
    email: {
      type: String,
      lowercase: true,
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
    statics: {
      validateJoi: createJoiValidator(validators),
      getByEmail,
      updateByEmail,
      SubscriptionTypes: subscriptionTypes,
    },
    methods: { comparePassword },
    versionKey: false,
  }
);

// Attach an error handling middleware
userSchema.post("save", interceptErrors);
// Attach a password obfuscating middleware
userSchema.pre("save", preSaveHandler);

const User = mongoose.model("User", userSchema);

module.exports = User;
