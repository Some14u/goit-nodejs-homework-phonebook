/** @typedef {import("express").RequestHandler} RequestHandler */

const service = require("../services/contacts");

/**
 *
 * @type {RequestHandler}
*/
const listContacts = async (req, res) => {
  const contacts = service.getAll();
  res.json(contacts);
}

/**
 *
 * @type {RequestHandler}
*/
const getContactById = async (req, res) => {
  const { id } = req.params.id;
  const contact = service.getById(id);
  res.json(contact);
}

/**
 *
 * @type {RequestHandler}
*/
const removeContact = async (req, res) => {
  const { id } = req.params.id;
  service.remove(id);
  res.end();
}

/**
 *
 * @type {RequestHandler}
*/
const addContact = async (req, res) => {
  const params = req.body;
  const contact = service.add(params);
  res.status(201).json(contact);
}

/**
 *
 * @type {RequestHandler}
*/
const updateContact = async (req, res) => {
  const { id } = req.params.id;
  const params = req.body;
  const contact = service.update(id, params);
  res.json(contact);
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact
};
