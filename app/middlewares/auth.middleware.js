/** @typedef {import("../helpers/types").RequestHandler} RequestHandler */
const { UnauthorizedError } = require("../helpers/errors");
const { filterObj } = require("../helpers/tools");
const jwt = require("../repositories/jwt.repo");

/**
 * This middleware ensures the user is logged in
 * @type {RequestHandler}
 */
function authGate(req, _, next) {
  authenticate(req)
    .then(next)
    .catch((err) => next(new UnauthorizedError(err)));
}

/**
 * Asyncrhonous authentication
 * @type {RequestHandler}
 */
async function authenticate(req) {
  // Extracting the token. Can fail on this stage.
  const token = extractToken(req.get("Authorization"));
  // Verifying token. Can also fail with specific jwt error.
  const credentials = await jwt.verify(token);
  // Searching for user by credentials. Throwing error on fail.
  const user = await req.services.user.getById(credentials.id);
  // The last failsafe — checking if this user actually has the token
  if (!user.token) throw new Error();

  // And now it seems safe to proceed further

  // Store credentials in local request context for future usage
  req.user = filterObj(user, ["_id id", "email", "subscription", "avatarURL"]);
}

const bearerIdentifier = "Bearer ";

/**
 * Parses the "Authorization" header and extracts token
 * @param {string} header
 * @throws generic error, should be rethrowed
 */
function extractToken(header) {
  if (!header) throw new Error();
  if (!header.startsWith(bearerIdentifier)) throw new Error();
  return header.slice(bearerIdentifier.length);
}

module.exports = authGate;
