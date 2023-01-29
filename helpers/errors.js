const Joi = require("joi");
const { messages } = require(".");

/**
 * Wraps each element in array of {@link RequestHandler|router handlers} with
 * a wrapper, capable to intercept and throw errors using the **next** parameter.
 * @param {Object.<string, RequestHandler>} routerRequestHandlers
 */
function wrapWithErrorHandling(routerRequestHandlers) {
  for (const [key, handler] of Object.entries(routerRequestHandlers)) {
    routerRequestHandlers[key] = (req, res, next) =>
      Promise.resolve(handler(req, res)).catch(next);
  }
}

/**
 * Main error handler. Handles custom types of errors (including Joi validation)
 * and manages correct status codes.
 * @type {import("express").ErrorRequestHandler} */
function errorHandler(err, _, res, __) {
  let status = 500;
  if (err instanceof NotFoundError) status = 404;
  else if (err instanceof MissingFieldsError) status = 400;
  else if (err instanceof Joi.ValidationError) status = 400;
  else if (err instanceof ExistError) status = 409;

  res.status(status).json({ message: err.message });
}

/** Error for adding document with existing name */
class ExistError extends Error {
  constructor(name) {
    super(messages.exist(name));
  }
}

/** Error for missing required parameter */
class MissingFieldsError extends Error {
  constructor() {
    super(messages.missingFields);
  }
}

/** Resource not found error */
class NotFoundError extends Error {
  constructor() {
    console.log("here");
    super(messages.notFound);
  }
}

/** Shows error in the console and exits */
function showErrorAndStopApp(msg) {
  return (error) => {
    console.error(messages[msg]?.(error) || error);
    process.exit(1);
  };
}

module.exports = {
  wrapWithErrorHandling,
  errorHandler,
  ExistError,
  MissingFieldsError,
  NotFoundError,
  showErrorAndStopApp,
};
