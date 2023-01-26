/** @typedef {import("express").RequestHandler} RequestHandler */

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

/** Custom error, that forwards the returning status code */
class ErrorWithStatusCode extends Error {
  status;
  /**
   * @param {number} status - the status code to forward
   * @param {object} message - the error message object
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

module.exports = {
  wrapWithErrorHandling,
  errorHandler,
  ErrorWithStatusCode,
};
