/** @typedef {import("../helpers/types").RequestHandler} RequestHandler */

/** @type {RequestHandler} */
function assignOwnerIdToService(req, __, next) {
  const id = req.user.id;
  req.services.contact.setOwnerId(id);
  next();
}

module.exports = assignOwnerIdToService;
