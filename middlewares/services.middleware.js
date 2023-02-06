const ContactService = require("../services/contact.service");
const UserService = require("../services/user.service");

/** @type {import("express").RequestHandler} */
function instantiateServices(req, __, next) {
  const services = {
    contact: new ContactService(),
    user: new UserService(),
  };
  req.services = services;
  next();
}

module.exports = instantiateServices;
