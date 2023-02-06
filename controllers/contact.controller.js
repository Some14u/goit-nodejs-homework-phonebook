/** @typedef {import("../helpers/types").RequestHandler} RequestHandler */
const messages = require("../helpers/messages");

/** @type {RequestHandler} */
const listContacts = async (req, res) => {
  const contacts = await req.services.contact.getAll(req.query);
  res.json(contacts);
};

/** @type {RequestHandler} */
const getContactById = async (req, res) => {
  const { id } = req.params;
  const contact = await req.services.contact.getById(id);
  res.json(contact);
};

/** @type {RequestHandler} */
const removeContact = async (req, res) => {
  const { id } = req.params;
  await req.services.contact.removeById(id);
  res.json(messages.contacts.deleted);
};

/** @type {RequestHandler} */
const addContact = async (req, res) => {
  const params = req.body;
  const contact = await req.services.contact.add(params);
  res.status(201).json(contact);
};

/** @type {RequestHandler} */
const updateContact = async (req, res) => {
  const { id } = req.params;
  const params = req.body;
  const contact = await req.services.contact.updateById(id, params);
  res.json(contact);
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
