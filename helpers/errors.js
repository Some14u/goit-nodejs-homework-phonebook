/** @typedef {import("../helpers/types").RequestHandler} RequestHandler */
const Joi = require("joi");
const mongoose = require("mongoose");
const messages = require("./messages");
const { isDev } = require("./settings");

/**
 * Wraps each element in given object of {@link RequestHandler|router handlers} with
 * a wrapper, capable to intercept and throw errors using the **next** parameter.
 * @param {Object.<string, RequestHandler>} routerRequestHandlers
 */
function wrapWithErrorHandling(routerRequestHandlers) {
  for (const [key, handler] of Object.entries(routerRequestHandlers)) {
    routerRequestHandlers[key] = (req, res, next) =>
      Promise.resolve(handler(req, res, next)).catch(next);
  }
}

/**
 * The main 404 handler
 * @type {RequestHandler}
 */
function globalNotFoundHandler(_, __, next) {
  next(new NotFoundError());
}

/**
 * Main error handler. Handles custom types of errors (including Joi validation)
 * and manages correct status codes.
 * @type {import("express").ErrorRequestHandler}
 */
function globalErrorHandler(err, _, res, __) {
  let status = 500;

  if (isDev) console.log(err);

  if (err instanceof ValidationError) status = 400;
  else if (err instanceof Joi.ValidationError) status = 400;
  // Technically in mongoose the casting phase is not a part of validation, but for us it's 400 anyway
  else if (err instanceof mongoose.Error.CastError) status = 400;
  else if (err instanceof mongoose.Error.ValidationError) status = 400;
  else if (err instanceof UnauthorizedError) status = 401;
  else if (err instanceof NotFoundError) status = 404;
  else if (err instanceof ExistError) status = 409;

  res.status(status).json({ message: err.message });
}

/** Error for adding document with existing name */
class ExistError extends Error {
  // Nothing here because it is required only to detect the error type
  // in globalErrorHanlder
}

/** Generic validation error handler */
class ValidationError extends Error {
  // Nothing here because it is required only to detect the error type
  // in globalErrorHanlder
}

class UnauthorizedError extends Error {
  constructor(msg) {
    super(msg || messages.users.notAuthorized);
  }
}

/** Resource not found error */
class NotFoundError extends Error {
  constructor() {
    super(messages.notFound);
  }
}

/** Show error in the console and exit */
function showErrorAndStopApp(msg) {
  return (error) => {
    console.error(typeof msg === "function" ? msg(error) : msg || error);
    process.exit(1);
  };
}

module.exports = {
  wrapWithErrorHandling,
  globalNotFoundHandler,
  globalErrorHandler,
  ExistError,
  ValidationError,
  UnauthorizedError,
  NotFoundError,
  showErrorAndStopApp,
};
