const fs = require("fs/promises");
const path = require("path");
const { Contact } = require("../models/contact");
const contactsPath = path.resolve("./", "models", "contacts.json");

let contacts;
// eslint-disable-next-line prefer-const
let autoSave = true;

/** Converts raw string to array of contacts. The id key would be converted to Number */
function parseRawData(data) {
  const reviver = (key, value) => (key === "id" ? Number(value) : value);
  return JSON.parse(data, reviver).map(Contact.create);
}

/** Loads contacts from file */
async function load() {
  const data = await fs.readFile(contactsPath, { encoding: "utf-8" });
  contacts = parseRawData(data);
}

/** Saves contacts to file */
async function save() {
  const data = JSON.stringify(contacts, null, 2);
  await fs.writeFile(contactsPath, data);
}

function getAll() {
  return contacts;
}

function getByIdx(idx) {
  return contacts[idx];
}

async function add({ name, email, phone }) {
  const contact = new Contact(findNextEmptyId, name, email, phone);
  contacts.push(contact);
  contacts.sort((a, b) => a.id - b.id);
  if (autoSave) await save();
}

async function updateByIdx(idx, contact) {
  contacts[idx] = { ...contacts[idx], ...contact };
  if (autoSave) await save();
}

async function removeByIdx(idx) {
  contacts = contacts.splice(idx, 1);
  if (autoSave) await save();
}

/** Converts id. Throws error if it isn't positive integer */
/* function convertIdToInteger(id) {
  if (!/^\d+$/.test(id)) throw text.idParseError(id);
  return +id;
} */

/** Finds contact by provided field and it's value */
function findIdxByField(fieldName, fieldValue) {
  const idx = contacts.findIndex((c) => c[fieldName] === fieldValue);
  // if (idx === -1) throw text.nothingFound(fieldName, fieldValue);
  return idx;
}

/** Calculates the first empty id value */
function findNextEmptyId() {
  let id = 1;
  for (const contact of contacts) {
    if (id < contact.id) return id;
    id = contact.id + 1;
  }
  return id;
}

/** Package ouptut messages */
/* const text = {
  nothingFound: (name, value) =>
    `There is no contact found with ${name}=${value}.`,
  unableToRemove: (id) =>
    `Unable to remove the contact with id=${id}. There is no such contact.`,
  removeSuccess: (id) => `Contact with id=${id} was succesfully removed.`,
  unableToAdd: (name) =>
    `Unable to add a contact for person with the name "${name}". It is already in the list.`,
  addSuccess: (id) => `A new contact with id=${id} was succesfully added.`,
  idParseError: (id) =>
    `The id parameter must be a positive integer. Provided value is "${id}".`,
}; */

load();

module.exports = {
  autoSave,
  save,
  getAll,
  getByIdx,
  add,
  removeByIdx,
  updateByIdx,
  findIdxByField,
};
