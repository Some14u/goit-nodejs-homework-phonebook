const api = require("../repositories/contacts");

const getAll = api.getAll;

function getById(id) {
  const idx = api.findIdxByField("id", +id);
  return api.getByIdx(idx);
}

async function remove(id) {
  const idx = api.findIdxByField("id", id);
  await api.removeByIdx(idx);
}

const add = api.add;

async function update(id, contact) {
  const idx = api.findIdxByField("id", id);
  await api.updateByIdx(idx, contact);
}

module.exports = {
  getAll,
  getById,
  remove,
  add,
  update,
};
