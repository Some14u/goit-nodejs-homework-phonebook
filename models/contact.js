const Joi = require("joi");
const ForwardedError = require("../helpers/forwardedError");

const patterns = {
  phone: /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
  consecutiveSpaces: /\s+/g,
};

/**
 * @typedef {{id: Number, name: String, email:String, phone: String}} ContactParams
 */

/** Class representing a contact */
class Contact {
  id;
  name;
  email;
  phone;

  static validationSchema = Joi.object({
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
      .regex(patterns.phone, { name: "reqired" })
      .label("phone"),
  });

  /**
   * Create a contact
   * @param {ContactParams} - object, containing initial values
   */
  constructor({ id, name, email, phone }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
  }

  /**
   * Provides **params** validation with {@link Contact.validationSchema|validators}
   * @param {ContactParams} params an object with fields to validate
   * @param {boolean} [required=true] adds required rule for every validator, otherwise default behaviour will be applied
   * @throws corresponding to validation error using {@link ForwardedError}
   * @return {ContactParams} corrected by validators parameters in case of success
   */
  static validateParams(params, required = true) {
    const res = Contact.validationSchema.validate(params, {
      presence: required ? "required" : "optional",
    });
    if (res.error) {
      throw new ForwardedError(
        400,
        res.error.details?.[0]?.message || "Validation error"
      );
    }
    return res.value;
  }

  /**
   * Tests names for equality by splitting them to words, and then testing
   * for symmetric dirrefence of those two word sets.
   *
   * The test is case insensitive.
   *
   * Basically, it works in the way that "Bob Ross" and "ROSS bob" considered equal.
   */
  static testNamesEquality(a, b) {
    const wordsA = a.toLocaleLowerCase().split(" ");
    const wordsB = b.toLocaleLowerCase().split(" ");
    return wordsA.filter((x) => !wordsB.includes(x)).length === 0;
  }
}

module.exports = Contact;
