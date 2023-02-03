const { ExistError, NotFoundError } = require("../helpers/errors");
const Contact = require("./model");

/** Returns a list of all contacts in the database */
async function getAll() {
  return await Contact.find().orFail(new NotFoundError());
}

/**
 * Searches a contact matching id
 * @param {Number} id  id of contact to be returned
 * @returns {Contact} the contact with provided id
 */
async function getById(id) {
  return await Contact.findById(id).orFail(new NotFoundError());
}

/**
 * Removes a contact matching id
 * @param {Number} id id of contact to be removed
 */
async function removeById(id) {
  await Contact.findByIdAndDelete(id).orFail(new NotFoundError());
}

/**
 * Adds a new contact using data, provided. The **id** is generated internally.
 * Checks the database for anoter contact with the same name.
 * @param params an object, containing **name**, **email**, and **phone** fields (**favorite** is optional).
 */
async function add(params) {
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
 * @param params an object, containing **name**, **email**, and **phone** fields (**favorite** is optional).
 */
async function updateById(id, params) {
  // Checking if we have "name" parameter and if so, then also checking,
  // if there is the same name already in the database(with another id)
  const match = await Contact.findOne(Contact.filterByNameQuery(params.name));
  if (match && match.id !== id) throw new ExistError(params.name);
  return await Contact.findByIdAndUpdate(id, params, { new: true }).orFail(
    new NotFoundError()
  );
}

/**
 * Updates existing contact favorite value.
 * @param {Number} id id of contact to be updated
 * @param {Object} param
 * @param {boolean} param.favorite a new value
 */
async function updateStatusContact(id, { favorite }) {
  return await Contact.findByIdAndUpdate(
    id,
    { favorite },
    { new: true }
  ).orFail(new NotFoundError());
}

module.exports = {
  add,
  getAll,
  getById,
  removeById,
  updateById,
  updateStatusContact,
};
