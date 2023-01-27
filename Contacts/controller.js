/** @typedef {import("express").RequestHandler} RequestHandler */
const { messages } = require("../helpers");
const service = require("./service");

/** @type {RequestHandler} */
const listContacts = async (_, res) => {
  const contacts = await service.getAll();
  res.json(contacts);
};

/** @type {RequestHandler} */
const getContactById = async (req, res) => {
  const { id } = req.params;
  const contact = await service.getByIdOrThrow(id);
  res.json(contact);
};

/** @type {RequestHandler} */
const removeContact = async (req, res) => {
  const { id } = req.params;
  await service.removeByIdOrThrow(id);
  res.json(messages.deleted);
};

/** @type {RequestHandler} */
const addContact = async (req, res) => {
  const params = req.body;
  const contact = await service.addOrThrow(params);
  res.status(201).json(contact);
};

/** @type {RequestHandler} */
const updateContact = async (req, res) => {
  const { id } = req.params;
  const params = req.body;
  const contact = await service.updateByIdOrThrow(id, params);
  res.json(contact);
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
