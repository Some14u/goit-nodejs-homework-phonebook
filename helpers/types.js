/**
 * @module myTypes
 * @typedef {{
 *    contact: import("../services/contact.service"),
 *    user: import("../services/user.service")
 * }} ServicesType
 *
 * @typedef {{id: String, email: String, subscription: String}} TokenCredentialsType
 *
 * @typedef {{services?: ServicesType} & {user?: TokenCredentialsType}} RequestContextType
 *
 * @callback RequestHandler
 * @param {import("express").Request & RequestContextType} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */

module.exports = {};
