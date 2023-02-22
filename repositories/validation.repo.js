const Joi = require("joi");

/**
 * @typedef {Object} JoiValidatorOptions
 * @property {[string]} [process] A list of model fields to validate.
 * Default is all keys that are possible to validate.
 * @property {[string]} [require] A list of model fields that are require to be present.
 * Default is empty.
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
  return (fields, { process, require = [], stripExtra = true } = {}) => {
    process ??= Object.keys(validators);
    for (const key of [...Object.keys(fields), ...process]) {
      // Strip all unwanted extra fields
      if (stripExtra && !process.includes(key)) {
        delete fields[key];
        continue;
      }
      // Validate against corresponding Joi schema
      const options = require.includes(key) && { presence: "required" };
      fields[key] = Joi.attempt(fields[key], validators[key], options);
    }
  };
}

module.exports = {
  createJoiValidator,
};
