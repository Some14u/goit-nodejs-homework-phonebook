const { ForwardedError } = require("../helpers");
const api = require("../repositories/contacts");

const getAll = api.getAll;

function getById(id) {
  const idx = api.findIdxByField("id", id);
  return api.getByIdx(idx);
}

async function remove(id) {
  const idx = api.findIdxByField("id", id);
  await api.removeByIdx(idx);
}

async function add(contact) {
  const idx = api.findIdxByField("name", contact.name);
  if (idx !== -1) throw new ForwardedError(409, `There is another contact with the same name`);
  return api.add(contact);
}

async function update(id, contact) {
  const idx = api.findIdxByField("id", id);
  if (idx === -1) throw new ForwardedError(404, `Not found`);
  await api.updateByIdx(idx, contact);
}

module.exports = {
  getAll,
  getById,
  remove,
  add,
  update,
};
