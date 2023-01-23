const ForwardedError = require("../helpers/forwardedError");
const { testNamesEquality } = require("../models/contact");
const api = require("../repositories/contacts");

/** Returns a list of all contacts in the database */
const getAll = api.getAll;

/**
 * Searches a contact matching id
 * @param {Number} id  id of contact to be returned
 * @return {Contact} the contact with provided id
 */
function getById(id) {
  const idx = getIdxByIdOrThrow(id);
  return api.getByIdx(idx);
}

/**
 * Removes a contact matching id
 * @param {Number} id id of contact to be removed
 * @return an object with success message
 */
async function remove(id) {
  const idx = getIdxByIdOrThrow(id);
  await api.removeByIdx(idx);
  return { message: "Contact deleted" };
}

/**
 * Adds a new contact using data, provided. The **id** is generated internally.
 * Checks the database for anoter contact with the same name.
 * @param params an object, containing **name**, **email**, and **phone** fields.
 */
async function add(params) {
  if (params?.name) {
    const idx = api.findIdxByField("name", params.name, testNamesEquality);
    if (idx !== -1) throw new ForwardedError("exist", [params.name]);
  }
  const res = await api.add(params);
  res.statusCode = 201;
  return res;
}

/**
 * Updates existing contact matching id, using data, provided.
 * Checks the database for anoter contact with the same name.
 * @param {Number} id id of contact to be updated
 * @param params an object, containing **name**, **email**, and **phone** fields.
 */
async function update(id, params) {
  // Checking if there are parameters
  if (!params || Object.keys(params).length === 0)
    throw new ForwardedError("missingFields");

  // Checking if there is a contact with provided id
  const idx = getIdxByIdOrThrow(id);

  // Checking if we have "name" parameter and if so, then also checking,
  // if there is the same name already in the database(with another idx)
  if (params.name) {
    const idx2 = api.findIdxByField("name", params.name, testNamesEquality);
    if (idx2 !== -1 && idx !== idx2)
      throw new ForwardedError("exist", [params.name]);
  }

  return await api.updateByIdx(idx, params);
}

/**
 * A helper function to reduce boilerplate. Searches the element with given id.
 * Throws error if there is none.
 * @param {Number} id  id of contact to be returned
 * @return index of the element with given id
 */
function getIdxByIdOrThrow(id) {
  const idx = api.findIdxByField("id", id);
  if (idx === -1) throw new ForwardedError("notFound");
  return idx;
}

/** Registering errors which could be yielded by the service */
ForwardedError.registerError("notFound", 404, "Not found")
  .registerError("exist", 409, 'There is another contact with "name" = "%s"')
  .registerError("missingFields", 400, "Missing fields");

module.exports = {
  getAll,
  getById,
  remove,
  add,
  update,
};
