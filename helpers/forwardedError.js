const { format } = require("util");

/**
 * This class is designed to be thrown as an error, providing
 * the **statusCode** and **message** for further processing in routers
 */
class ForwardedError {
  statusCode;
  message;

  static knownErrors = [];

  /**
   * Can be built in three ways:
   * - explicit **statusCode** and **message** as **first** and **second** parameters
   * - an array of **statusCode** and **message** as **first** parameter
   * - one of shortNames, preregistered with {@link registerError}.
   *   In this case the second parameter could have an array of substrings,
   *   which will be applied to the **message** using util.format
   */
  constructor(first, second) {
    [this.statusCode, this.message] = [first, second];
    if (Array.isArray(first)) {
      [this.statusCode, this.message] = first;
    } else if (ForwardedError.knownErrors[first]) {
      [this.statusCode, this.message] = ForwardedError.knownErrors[first];
      if (Array.isArray(second)) this.message = format(this.message, ...second);
    }
  }

  /**
   * Adds an error to the class static to be used as a third variant in constructor.
   * Allows chaining
   */
  static registerError(shortName, statusCode, message) {
    ForwardedError.knownErrors[shortName] = [statusCode, message];
    return ForwardedError;
  }
}

module.exports = ForwardedError;
