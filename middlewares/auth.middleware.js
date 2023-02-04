/** @typedef {import("express").RequestHandler} RequestHandler */
const jwt = require("jsonwebtoken");
const User = require("../Users/model");
const { UnauthorizedError } = require("../helpers/errors");
const { authentication } = require("../helpers/settings");
const request = require("../requestContext");

/**
 * This middleware ensures the user is logged in
 * @type {RequestHandler}
 */
function authGate(req, _, next) {
  try {
    // Extracting the token. Can fail on his stage.
    const token = extractToken(req.get("Authorization"));

    // Verifying token. Can also fail with specific jwt message.
    const credentials = jwt.verify(token, authentication.jwtSecret);

    // Searching for user from credentials. Throwing error on fail.
    const user = User.findById(credentials.id).orFail(new Error());

    // The last failsafe — checking if this user actually has the token
    if (!user.token) throw new Error();

    // And now it seems safe to proceed further

    // Store credentials in local request context for future usage
    request.context.user = credentials;
    next();
  } catch (err) {
    // All errors would share the same 401 statuscode
    next(new UnauthorizedError(err.message));
  }
}

/** @param {string} header */
function extractToken(header) {
  if (!header || typeof header !== "string") throw new Error();
  const parts = header.split(" ");
  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer")
    throw new Error();
  return parts[1];
}

module.exports = authGate;
