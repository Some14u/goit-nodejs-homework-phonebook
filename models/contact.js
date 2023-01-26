const Joi = require("joi");
const { ErrorWithStatusCode } = require("../helpers");

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
   * @param {Joi.PresenceMode} [presence] applies presence rule for every validator, otherwise default behaviour will be applied
   * @throws corresponding to validation error using {@link ErrorWithStatusCode}
   * @return {ContactParams} corrected by validators parameters in case of success
   */
  static validateParams(params, presence) {
    const res = Contact.validationSchema.validate(
      params,
      presence && { presence }
    );
    if (!res.error) return res.value;
    throw new ErrorWithStatusCode(400, res.error.details?.[0]?.message);
  }

  /**
   * Validates one field by it's name and value, using {@link Contact.validationSchema|validation schema}.
   * Always remember to set the new value of the validated field, because validation may cause this value to change.
   * @param {string} name the name of the field to validate
   * @param {any} value the value of the field to validate
   * @param {Joi.PresenceMode} [presence] applies presence rule for every validator, otherwise default behaviour will be applied
   * @throws corresponding to validation error using {@link ErrorWithStatusCode}
   * @return {any} validated value in case of success. Note, that Joi validation can cause the value to change.
   */
  static validateOneField(name, value, presence) {
    const rule = this.validationSchema.extract(name);
    const res = rule.validate(value, presence && { presence });
    if (!res.error) return res.value;
    throw new ErrorWithStatusCode(400, res.error.details?.[0]?.message);
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
