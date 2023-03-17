const util = require("util");
const jwt = require("jsonwebtoken");
const { secret } = require("../helpers/settings").authentication.jwt;

const promisified = {
  verify: util.promisify(jwt.verify),
  sign: util.promisify(jwt.sign),
};

/** Promisified jwt.verify with built-in secret */
function verify(token) {
  return promisified.verify(token, secret);
}

/** Promisified jwt.sign with built-in secret and lifeTime parameter */
function sign(payload, lifeTime) {
  return promisified.sign(payload, secret, { expiresIn: lifeTime });
}

/** Asyncrhonous versions of jwt functions, based on promises */
module.exports = {
  verify,
  sign,
};
