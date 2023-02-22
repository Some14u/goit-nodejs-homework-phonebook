const util = require("util");
const jwt = require("jsonwebtoken");

/** Asyncrhonous versions of jwt functions, based on promises */
module.exports = {
  verify: util.promisify(jwt.verify),
  sign: util.promisify(jwt.sign),
};
