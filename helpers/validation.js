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
 * Creates a {@link validateJoi|validateJoi validator}. The returned function suppose
 * to be used as static method of mongoDb Schema.
 * @param {Object.<string, Joi>} validators - object of simple per/field Joi validators
 */
function createJoiValidator(validators) {
  /**
   * Validates object with fields by using {@link Contact.validators|validators}.
   * The values of the object may change after validation due to possible normalization.
   *
   * the presence status per field is calculated from presenceList parameter.
   * @param fields an object with raw fields to validate
   * @param {[string]|"all"} [presenceList] an array of keys, which are required to be present. Could also be "all".
   * @throws corresponding validation error using {@link ErrorWithStatusCode}
   */
  function validateJoi(fields, presenceList = []) {
    presenceList = resolvePresence(presenceList);
    for (const key of Object.keys(validators)) {
      const value = Joi.attempt(fields[key], validators[key], {
        presence: presenceList[key],
      });
      if (typeof value !== "undefined") fields[key] = value;
    }
  }

  /**
   * Resolves presence list. If there is "+ALL" element, it sets defaults values
   * for all fields to "required", otherwice defaults will be "optional".
   * After that any of elements with leading "-" will turn corresponding rule
   * to "optional".
   *
   * **Example input**: ["+ALL", "-id", "-favorite"]
   */
  function resolvePresence(presenceList) {
    const def = presenceList.includes("+ALL") ? "required" : "optional";
    const presence = {};
    Object.keys(validators).forEach((key) => {
      const rule = presenceList.find((k) => k.endsWith(key));
      presence[key] = rule
        ? rule.startsWith("-")
          ? "optional"
          : "required"
        : def;
    });
    return presence;
  }

  return validateJoi;
}

module.exports = {
  createValidatorMiddleware,
  createJoiValidator,
};
