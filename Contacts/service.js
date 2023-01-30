const { ExistError, NotFoundError } = require("../helpers/errors");
const Contact = require("./model");

/** Returns a list of all contacts in the database */
async function getAllOrThrow() {
  return await Contact.find().orFail(new NotFoundError());
}

/**
 * Searches a contact matching id
 * @param {Number} id  id of contact to be returned
 * @return {Contact} the contact with provided id
 */
async function getByIdOrThrow(id) {
  return await Contact.findById(id).orFail(new NotFoundError());
}

/**
 * Removes a contact matching id
 * @param {Number} id id of contact to be removed
 * @return an object with success message
 */
async function removeByIdOrThrow(id) {
  await Contact.findByIdAndDelete(id).orFail(new NotFoundError());
}

/**
 * Adds a new contact using data, provided. The **id** is generated internally.
 * Checks the database for anoter contact with the same name.
 * @param params an object, containing **name**, **email**, and **phone** fields.
 */
async function addOrThrow(params) {
  const match = await Contact.findOne(Contact.filterByNameQuery(params.name));
  if (match) throw new ExistError(params.name);
  const contact = new Contact(params);
  await contact.save();
  return contact;
}

/**
 * Updates existing contact matching id, using data, provided.
 * Checks the database for anoter contact with the same name.
 * @param {Number} id id of contact to be updated
 * @param params an object, containing **name**, **email**, and **phone** fields.
 */
async function updateByIdOrThrow(id, params) {
  // Checking if we have "name" parameter and if so, then also checking,
  // if there is the same name already in the database(with another id)
  const match = await Contact.findOne(Contact.filterByNameQuery(params.name));
  if (match && match.id !== id) throw new ExistError(params.name);
  return await Contact.findByIdAndUpdate(id, params, { new: true });
}

async function updateStatusContact(id, params) {
  console.log("updateStatusContact", params)
  // await Contact.findByIdAndUpdate(id, params, { new: true });
}

module.exports = {
  getAllOrThrow,
  getByIdOrThrow,
  removeByIdOrThrow,
  addOrThrow,
  updateByIdOrThrow,
  updateStatusContact,
};
