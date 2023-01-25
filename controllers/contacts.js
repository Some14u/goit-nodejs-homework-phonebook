const express = require("express");
const router = express.Router();

const service = require("../services/contacts");

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
const listContactsHandler = async (req, res) => {
  service.getAll();
  res.
}

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
const getContactByIdHandler = async (req, res) => {
  const { id } = req.params.id;

}

const removeContactHandler = async (req, res) => {}

const addContactHandler = async (req, res) => {}

const updateContactHandler = async (req, res) => { }

module.exports = {
  listContacts: listContactsHandler,
  getContactById: getContactByIdHandler,
  removeContact: removeContactHandler,
  addContact: addContactHandler,
  updateContact: updateContactHandler
};
