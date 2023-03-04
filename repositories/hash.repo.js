const bcrypt = require("bcrypt");

/** Hashes data using bcrypt module */
function apply(data) {
  return bcrypt.hash(data, 8);
}

module.exports = {
  apply,
  compare: bcrypt.compare,
};
