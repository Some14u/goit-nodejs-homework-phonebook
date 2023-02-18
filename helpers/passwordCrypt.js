const bcrypt = require("bcrypt");

// TODO: description required
function hash(password) {
  return bcrypt.hash(password, 8);
}

module.exports = {
  hash,
  compare: bcrypt.compare,
};
