const { testNamesEquality } = require("../controllers/common");
const ForwardedError = require("../helpers/forwardedError");
const api = require("../repositories/contacts");

const getAll = api.getAll;

function getById(id) {
  const idx = api.findIdxByField("id", id);
  if (idx === -1) throw new ForwardedError("notFound");
  return api.getByIdx(idx);
}

async function remove(id) {
  const idx = api.findIdxByField("id", id);
  await api.removeByIdx(idx);
}

async function add(contact) {
  const idx = api.findIdxByField("name", contact.name, testNamesEquality);
  if (idx !== -1) throw new ForwardedError("exist");
  return api.add(contact);
}

async function update(id, contact) {
  const idx = api.findIdxByField("id", id);
  if (idx === -1) throw new ForwardedError("notFound");
  await api.updateByIdx(idx, contact);
}

module.exports = {
  getAll,
  getById,
  remove,
  add,
  update,
};
