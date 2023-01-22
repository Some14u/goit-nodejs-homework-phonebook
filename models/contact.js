const Joi = require("joi");
const { ForwardedError } = require("../helpers/forwardedError");

const patterns = {
  phone: /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
  consecutiveSpaces: /\s+/g,
};

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
      .alphanum()
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

  static validationSchema = Joi.object(Contact.validators);

  constructor({ id, name, email, phone }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
  }

  static validateParams(raw, required = true) {
    const res = Contact.validationSchema.validate(raw, {
      presence: required ? "required" : "optional",
    });
    if (res.error) {
      throw new ForwardedError(400, res.error.details[0].message);
    }
    return res.value;
  }
}

module.exports = {
  Contact,
};
