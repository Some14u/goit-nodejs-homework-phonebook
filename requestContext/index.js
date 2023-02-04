/** @typedef {import("express").RequestHandler} RequestHandler */

const { AsyncLocalStorage } = require("async_hooks");

const storage = new AsyncLocalStorage();

/**
 * Provides a handler middleware to setup the request context storage.
 * @param {Object} initialContextValue Initial context state object.
 * For the sake of simplicity only shallow copy of the object will be assigned
 * to each request context.
 * @returns {RequestHandler} An express handler middleware
 */
exports.provideHandler = function (initialContextValue = {}) {
  return (_, __, next) => {
    storage.run({ ...initialContextValue }, next);
  };
};

/**
 * A context, specific to current request. This essentially is a virtual property
 * which maps to the {@link AsyncLocalStorage} store.
 */
exports.context = undefined;

Object.defineProperty(module.exports, "context", {
  get: storage.getStore.bind(storage),
});
