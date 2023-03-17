const ContactService = require("../services/contact.service");
const UserService = require("../services/user.service");

/**
 * Services are Classes, and this instantiates them.
 * Thus it is possible to link certain service settings
 * directly to the current request context.
 *
 * I use this to link authenticated user id, which allows to
 * use services without need to pass user id explicitly.
 * @type {import("express").RequestHandler}
 */
function instantiateServices(req, __, next) {
  const services = {
    contact: new ContactService(),
    user: new UserService(),
  };
  req.services = services;
  next();
}

module.exports = instantiateServices;
