const fs = require("fs/promises");
const { Contact } = require("../models/contact");

let contacts;
let contactsPath;
// eslint-disable-next-line prefer-const
let autoSave = true;

/** Converts raw string to array of contacts. The id key would be converted to Number */
function parseRawData(data) {
  const reviver = (key, value) => (key === "id" ? Number(value) : value);
  return JSON.parse(data, reviver).map((contact) => new Contact(contact));
}

/** Loads contacts from file */
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

function getAll() {
  return contacts;
}

function getByIdx(idx) {
  return contacts[idx];
}

async function add(params) {
  params.id = findNextEmptyId();
  params = Contact.validateParams(params);
  const contact = new Contact(params);
  contacts.push(contact);
  contacts.sort((a, b) => a.id - b.id);
  if (autoSave) await save();
  return contact;
}

async function updateByIdx(idx, contact) {
  contacts[idx] = Contact.create({ ...contacts[idx], ...contact });
  if (autoSave) await save();
  return contacts[idx];
}

async function removeByIdx(idx) {
  contacts = contacts.splice(idx, 1);
  if (autoSave) await save();
}

/** Finds contact by provided field and it's value */
function findIdxByField(name, value, comparator) {
  const res = Contact.validateParams({ [name]: value }, false);
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
