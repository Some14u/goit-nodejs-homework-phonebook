/** @typedef {import("express").RequestHandler} RequestHandler */
const messages = require("../helpers/messages");
const service = require("./service");

/** @type {RequestHandler} */
const listContacts = async (_, res) => {
  const contacts = await service.getAll();
  res.json(contacts);
};

/** @type {RequestHandler} */
const getContactById = async (req, res) => {
  const { id } = req.params;
  const contact = await service.getById(id);
  res.json(contact);
};

/** @type {RequestHandler} */
const removeContact = async (req, res) => {
  const { id } = req.params;
  await service.removeById(id);
  res.json(messages.deleted);
};

/** @type {RequestHandler} */
const addContact = async (req, res) => {
  const params = req.body;
  const contact = await service.add(params);
  res.status(201).json(contact);
};

/** @type {RequestHandler} */
const updateContact = async (req, res) => {
  const { id } = req.params;
  const params = req.body;
  const contact = await service.updateById(id, params);
  res.json(contact);
};

/** @type {RequestHandler} */
const updateContactStatus = async (req, res) => {
  const { id } = req.params;
  const params = req.body;
  const contact = await service.updateStatusContact(id, params);
  res.json(contact);
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateContactStatus,
};
