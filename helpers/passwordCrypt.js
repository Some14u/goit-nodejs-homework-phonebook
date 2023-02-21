const bcrypt = require("bcrypt");

/** Obfuscates the password using bcrypt module */
function hash(password) {
  return bcrypt.hash(password, 8);
}

module.exports = {
  hash,
  compare: bcrypt.compare,
};
