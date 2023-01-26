const fs = require("fs/promises");
const Contact = require("../models/contact");

// Internal memory contacts storage
let contacts;
// Current db address, populated by initDB
let contactsPath;
// eslint-disable-next-line prefer-const
let autoSave = true;

/** Converts raw string to array of contacts. The id key would be converted to Number */
function parseRawData(data) {
  return JSON.parse(data).map((contact) => new Contact(contact));
}

/** Loads all contacts from file */
async function initDB(path) {
  contactsPath = path;
  const data = await fs.readFile(path, { encoding: "utf-8" });
  contacts = parseRawData(data);
}

/** Saves contacts to file */
async function save() {
  const data = JSON.stringify(contacts, null, 2);
  await fs.writeFile(contactsPath, data);
}

/** Returns all contacts */
function getAll() {
  return contacts;
}

/** Returns a single contact by index */
function getByIdx(idx) {
  return contacts[idx];
}

/**
 * Adds a contact with params validation
 * Can throw validation error
 */
async function add(params) {
  params.id = findNextEmptyId();
  const validatedParams = Contact.validateParams(params);
  const contact = new Contact(validatedParams);
  contacts.push(contact);
  contacts.sort((a, b) => a.id - b.id);
  if (autoSave) await save();
  return contact;
}

/**
 * Updates contact by index with params validation
 * Can throw validation error
 */
async function updateByIdx(idx, params) {
  const rawParams = { ...params, id: contacts[idx].id };
  const validatedParams = Contact.validateParams(rawParams);

  // I decided to update contacts immutably
  contacts[idx] = new Contact(validatedParams);
  if (autoSave) await save();
  return contacts[idx];
}

/** Removes a contact by index */
async function removeByIdx(idx) {
  contacts.splice(idx, 1);
  if (autoSave) await save();
}

/** Finds contact by provided field and it's value */
function findIdxByField(name, value, comparator) {
  const res = Contact.validateParams({ [name]: value }, "optional");
  const idx = contacts.findIndex(
    (c) => comparator?.(c[name], res[name]) ?? c[name] === res[name]
  );
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

module.exports = {
  initDB,
  autoSave,
  save,
  getAll,
  getByIdx,
  add,
  removeByIdx,
  updateByIdx,
  findIdxByField,
};
