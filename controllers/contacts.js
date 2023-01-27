/** @typedef {import("express").RequestHandler} RequestHandler */
const { ErrorWithStatusCode, messages } = require("../helpers");
const service = require("../services/contacts");

/**
 *
 * @type {RequestHandler}
 */
const listContacts = async (_, res) => {
  const contacts = await service.getAll();
  res.json(contacts);
};

/**
 *
 * @type {RequestHandler}
 */
const getContactById = async (req, res) => {
  const { id } = req.params.id;
  const contact = await service.getById(id);
  if (!contact) throw ErrorWithStatusCode(404, messages.notFound);
  res.json(contact);
};

/**
 *
 * @type {RequestHandler}
 */
const removeContact = async (req, res) => {
  const { id } = req.params.id;
  const statusOk = await service.remove(id);
  if (!statusOk) throw ErrorWithStatusCode(404, messages.notFound);
  res.json(messages.deleted);
};

/**
 *
 * @type {RequestHandler}
 */
const addContact = async (req, res) => {
  const params = req.body;
  const contact = await service.add(params);
  res.status(201).json(contact);
};

/**
 *
 * @type {RequestHandler}
 */
const updateContact = async (req, res) => {
  const { id } = req.params.id;
  const params = req.body;
  const contact = service.update(id, params);
  res.json(contact);
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
