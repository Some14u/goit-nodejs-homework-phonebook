/** @typedef {import("../helpers/types").RequestHandler} RequestHandler */

/**
 * This middleware assigns current user id to the contact service.
 * The service then uses it implicitly without need to pass in every method.
 * @type {RequestHandler}
 */
function assignOwnerIdToService(req, __, next) {
  const id = req.user.id;
  req.services.contact.setOwnerId(id);
  next();
}

module.exports = assignOwnerIdToService;
