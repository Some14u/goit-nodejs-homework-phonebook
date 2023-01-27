const { testNamesEquality } = require("./model");
const api = require("../db/fsApi");
const { ExistError, NotFoundError } = require("../helpers/errors");

/** Returns a list of all contacts in the database */
function getAll() {
  return api.getAll();
}

/**
 * Searches a contact matching id
 * @param {Number} id  id of contact to be returned
 * @return {Contact} the contact with provided id
 */
function getByIdOrThrow(id) {
  const idx = getIdxByIdOrThrow(id);
  return api.getByIdx(idx);
}

/**
 * Removes a contact matching id
 * @param {Number} id id of contact to be removed
 * @return an object with success message
 */
async function removeByIdOrThrow(id) {
  const idx = getIdxByIdOrThrow(id);
  await api.removeByIdx(idx);
}

/**
 * Adds a new contact using data, provided. The **id** is generated internally.
 * Checks the database for anoter contact with the same name.
 * @param params an object, containing **name**, **email**, and **phone** fields.
 */
async function addOrThrow(params) {
  if (params?.name) {
    const idx = api.findIdxByField("name", params.name, testNamesEquality);
    if (idx !== -1) throw new ExistError(params.name);
  }
  const res = await api.add(params);
  return res;
}

/**
 * Updates existing contact matching id, using data, provided.
 * Checks the database for anoter contact with the same name.
 * @param {Number} id id of contact to be updated
 * @param params an object, containing **name**, **email**, and **phone** fields.
 */
async function updateByIdOrThrow(id, params) {
  // Checking if there is a contact with provided id
  const idx = getIdxByIdOrThrow(id);

  // Checking if we have "name" parameter and if so, then also checking,
  // if there is the same name already in the database(with another idx)
  if (params.name) {
    const idx2 = api.findIdxByField("name", params.name, testNamesEquality);
    if (idx2 !== -1 && idx !== idx2) throw new ExistError(params.name);
  }
  return await api.updateByIdx(idx, params);
}

/**
 * A helper function to reduce boilerplate. Searches the element with given id.
 * @param {Number} id id of contact to be returned
 * @param {any} error an error to be thrown
 * @return index of the element with provided id
 * @throws {@link NotFoundError} error if there is no result found.
 */
function getIdxByIdOrThrow(id) {
  const idx = api.findIdxByField("id", id);
  if (idx === -1) throw new NotFoundError();
  return idx;
}

module.exports = {
  getAll,
  getByIdOrThrow,
  removeByIdOrThrow,
  addOrThrow,
  updateByIdOrThrow,
};
