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
      res.json(result);
    } catch (error) {
      // Any error will be caught and converted to json in the finally section
      console.log("ERROR", error);
      if (error.statusCode) res.status(error.statusCode);
      res.json({ message: error.message || error });
    }
  };
}

function testNamesEquality(a, b) {
  const wordsA = a.toLocaleLowerCase().split(" ");
  const wordsB = b.toLocaleLowerCase().split(" ");
  return wordsA.filter((x) => !wordsB.includes(x)).length === 0;
}

module.exports = {
  wrapWithHandlers,
  testNamesEquality,
};
