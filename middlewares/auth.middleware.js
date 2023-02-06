/** @typedef {import("../helpers/types").RequestHandler} RequestHandler */
const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../helpers/errors");
const { authentication, isDev } = require("../helpers/settings");

/**
 * This middleware ensures the user is logged in
 * @type {RequestHandler}
 */
function authGate(req, _, next) {
  authenticate(req)
    .then(next)
    .catch((err) => next(new UnauthorizedError(isDev && err)));
}

/**
 * Asyncrhonous authentication
 * @type {RequestHandler}
 */
async function authenticate(req) {
  // Extracting the token. Can fail on his stage.
  const token = extractToken(req.get("Authorization"));
  // Verifying token. Can also fail with specific jwt error.
  const credentials = await jwtVerifyAsync(token, authentication.jwtSecret);
  // Searching for user by credentials. Throwing error on fail.
  const user = await req.services.user.getById(credentials.id);
  // The last failsafe — checking if this user actually has the token
  if (!user.token) throw new Error();

  // And now it seems safe to proceed further

  // Store credentials in local request context for future usage
  req.user = credentials;
}

/**
 * Parses the "Authorization" header
 * @param {string} header
 * @throws generic error, should be rethrowed
 */
function extractToken(header) {
  if (!header || typeof header !== "string") throw new Error();
  const parts = header.split(" ");
  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer")
    throw new Error();
  return parts[1];
}

/** Asyncrhonous version of jwt.verify, based on promises */
function jwtVerifyAsync(token, secret) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, credentials) => {
      if (err) return reject(err);
      resolve(credentials);
    });
  });
}

module.exports = authGate;
