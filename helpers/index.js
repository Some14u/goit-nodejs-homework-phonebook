/** @typedef {import("express").RequestHandler} RequestHandler */

/**
 * Creates a valid {@link RequestHandler|router handler} that applies provided
 * validator to specified request data source.
 * @param {String} dataSource - either **params**, **body**, **query** or **headers**.
 * @param {Function} validator - a validator function to validate data source.
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
 * Wraps each element in array of {@link RequestHandler|router handlers} with
 * a wrapper, capable to intercept and throw errors using the **next** parameter.
 * @param {[RequestHandler]} routerRequestHandlers
 */
function wrapWithErrorHandling(routerRequestHandlers) {
  for (const [i, handler] of routerRequestHandlers.entries()) {
    routerRequestHandlers[i] = (req, res, next) =>
      handler(req, res).catch(next);
  }
}

/** Custom error that contains the forwarding status code */
class ErrorWithStatusCode extends Error {
  status;
  /**
   * @param {number} status - status code to forward
   * @param {object} message - error message object
   */
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

/**
 * @type {import("express").ErrorRequestHandler}
 */
function errorHandler(err, _, res, __) {
  const status = Number(err.status) || 500;
  res.status(status).json({ message: err.message });
}

const messages = {
  notFound: "Not found",
  exist: 'There is another contact with "name" = "%s"',
  missingFields: "Missing fields",
  deleted: "Contact deleted",
};

module.exports = {
  createValidatorMiddleware,
  wrapWithErrorHandling,
  ErrorWithStatusCode,
  errorHandler,
  messages,
};
