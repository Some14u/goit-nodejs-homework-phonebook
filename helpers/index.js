/** @typedef {import("express").RequestHandler} RequestHandler */

// List of all possible custom messages
const messages = {
  notFound: "Not found",
  exist: 'There is another contact with "name" = "%s"',
  missingFields: "Missing fields",
  deleted: "Contact deleted",
};

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
 * Main 404 handler
 * @type {RequestHandler} */
function notFoundHandler(_, res) {
  res.status(404).json({ message: messages.notFound });
}

module.exports = {
  messages,
  createValidatorMiddleware,
  notFoundHandler,
};
