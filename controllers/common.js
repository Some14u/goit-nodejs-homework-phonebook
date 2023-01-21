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
  return (req, res) => {
    let result;
    try {
      console.log(...Object.values(req.params))
      result = method(...Object.values(req.params), req.body, req.query);
    } catch (error) {
      // Any error will be caught and converted to json in the finally section
      result = error;
    } finally {
      res.json(result);
    }
  };
}

module.exports = {
  wrapWithHandlers,
};
