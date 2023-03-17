/**
 * Filters object by the list of allowed keys
 * @param {any} obj - an object to filter
 * @param {Array.<string|string[]>} keyList - an array of keys. Items can be strings denoting key names. They can also be pairs like "orignalKeyName destinationKeyName" or [originalKeyName, destinationKeyName]. For example "_id id" or ["_id", "id"].
 */
function filterObj(obj, keyList) {
  return keyList
    .map((key) => (Array.isArray(key) ? key : key.split(" ")))
    .reduce((res, key) => ({ ...res, [key.at(-1)]: obj[key[0]] }), {});
}

module.exports = {
  filterObj,
};
