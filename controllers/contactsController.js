const express = require("express");

const service = require("../services/contacts");

/**
 *
 * @type {express.RequestHandler}
*/
const listContacts = async (req, res) => {
  const contacts = service.getAll();
  res.json(contacts);
}

/**
 *
 * @type {express.RequestHandler}
*/
const getContactById = async (req, res) => {
  const { id } = req.params.id;
  const contact = service.getById(id);
  res.json(contact);
}

/**
 *
 * @type {express.RequestHandler}
*/
const removeContact = async (req, res) => {
  const { id } = req.params.id;
  const contact = service.remove(id);
  res.json();
}

/**
 *
 * @type {express.RequestHandler}
*/
const addContact = async (req, res) => {
  const params = req.body;
  const contact = service.add(params);
  res.json(contact);
}

/**
 *
 * @type {express.RequestHandler}
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
