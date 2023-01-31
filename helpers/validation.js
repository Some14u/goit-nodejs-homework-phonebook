/** @typedef {import("express").RequestHandler} RequestHandler */
const Joi = require("joi");

/**
 * Creates a valid {@link RequestHandler|router handler} that applies provided
 * validator to specified request data source.
 * @param {string} dataSource - either **params**, **body**, **query** or **headers**.
 * @param {function} validator - a validator function to validate data source.
 * @param {[string]} requiredList - a list of keys, which are required to be present. Default is empty.
 * @returns {RequestHandler} a router handler to be used as middleware
 */
function createValidatorMiddleware(dataSource, validator, requiredList) {
  return (req, res, next) => {
    try {
      validator(req[dataSource], requiredList);
      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * @typedef {Object} JoiValidatorOptions
 * @property {[string]} [process] A list of model fields to validate.
 * Default is all keys that are possible to validate.
 * @property {[string]} [required] A list of model fields that are required.
 * to be present. Default is empty.
 * @property {boolean} stripExtra If *true* it will remove all extra fields passed to validator,
 * which are not in **process** list. By default it is true.
 *
 * @callback validateJoi
 * @param {Object.<string, any>} fields An object with raw fields to validate
 * @param {JoiValidatorOptions} options an {@link JoiValidatorOptions option} object to control
 * validation behaviour.
 */

/**
 * Creates a {@link validateJoi|validateJoi validator} based on given joi validation schema.
 * The returned function suppose to be used as static method of mongoDb schema.
 * @param {Object.<string, Joi>} validators - object of simple per/field Joi validators
 * @returns {validateJoi}
 */
function createJoiValidator(validators) {
  return (fields, { process, required = [], stripExtra = true }) => {
    if (!process) process = Object.keys(validators);
    for (const key of Object.keys(fields)) {
      // Strip all unwanted extra fields
      if (stripExtra && !process.includes(key)) {
        delete fields[key];
        continue;
      }
      // Validate against corresponding Joi schema
      const options = required.includes(key) && { presence: "required" };
      fields[key] = Joi.attempt(fields[key], validators[key], options);
    }
  };
}

module.exports = {
  createValidatorMiddleware,
  createJoiValidator,
};
