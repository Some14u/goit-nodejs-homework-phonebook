/**
 * Wraps service methods with handlers suitable to be used by router.
 *
 * Methods will be called with parameters described in {@link wrapMethodWithHandler} function.
 * @param service - a service whose methods to wrap.
 */
function wrapWithHandlers(service) {
  const handlers = {};
  Object.keys(service).forEach((method) => {
    handlers[method] = wrapMethodWithHandler(service[method]);
  });
  return handlers;
}

/**
 * Wraps a single method with handler.
 * @param method - a method to wrap.
 *
 * @returns Wrapped method. The following parameters will be passed to it:
 * - params (e.g. :id) - Spread used, so they will come as distinct parameters
 * - body (any object provided) - Always produces at least an empty object
 * - query (e.g. ?a1=a11&b1=b11) - Always produces at least an empty object
 *
 * Also, the result of the method will be checked for having the **statusCode**
 * parameter, which might be used to control the returning status code from within.
 */
function wrapMethodWithHandler(method) {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  return async (req, res) => {
    try {
      const result = await method(
        ...Object.values(req.params),
        req.body,
        req.query
      );
      // Kind of sketchy solution for statusCode forwarding, however it works
      if (result?.statusCode) {
        console.log("result.statuscode", result.statusCode);
        res.status(result.statusCode);
        delete result.statusCode;
      }
      res.json(result);
    } catch (error) {
      // Any error will be caught and converted to json
      if (error.statusCode) res.status(error.statusCode);
      res.json({ message: error.message || error });
    }
  };
}

module.exports = {
  wrapWithHandlers,
};
