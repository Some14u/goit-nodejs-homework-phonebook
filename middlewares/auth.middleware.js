/** @typedef {import("express").RequestHandler} RequestHandler */
const jwt = require("jsonwebtoken");
const { authentication } = require("../helpers/settings");
const requestContext = require("../requestContext");

/** @type {RequestHandler} */
function authGate(req, next) {
  const token = extractToken(req.get("Authorization"));
  const credentials = jwt.verify(token, authentication.jwtSecret);
  requestContext.put()
}

/** @param {string} header */
function extractToken(header) {
  if (!header || typeof header !== "string") {
    throw new Error("Not authenticated");
  }
  const parts = header.split(" ");
  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
    throw new Error("Not authenticated");
  }
  return parts[1];
}

module.exports = authGate;
