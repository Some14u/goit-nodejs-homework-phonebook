const Joi = require("joi");

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

  static validators = {
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
  };

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
   * Validates object with fields by using {@link Contact.validators|validators}.
   * The values of the object may change after validation due to possible normalization.
   * @param {ContactParams} fields an object with raw fields to validate
   * @param {[string]|"all"} [requiredList] an array of keys, which are required to be present. Could also be "all".
   * @throws corresponding validation error using {@link ErrorWithStatusCode}
   */
  static validate(fields, requiredList = []) {
    for (const [key, validator] of Object.entries(Contact.validators)) {
      const required = requiredList === "all" || requiredList?.includes(key);
      const value = Joi.attempt(
        fields[key],
        validator,
        required && { presence: "required" }
      );
      if (typeof value !== "undefined") fields[key] = value;
    }
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
    return (
      wordsA.length === wordsB.length &&
      wordsA.filter((x) => !wordsB.includes(x)).length === 0
    );
  }
}

module.exports = Contact;
