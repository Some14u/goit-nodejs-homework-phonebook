/** @typedef {import("../helpers/types").RequestHandler} RequestHandler */
const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../helpers/errors");
const messages = require("../helpers/messages");
const settings = require("../helpers/settings");

/** @type {RequestHandler} */
async function signup(req, res) {
  const { email, subscription } = await req.services.user.add(req.body);
  res.status(201).json({ user: { email, subscription } });
}

/** @type {RequestHandler} */
async function signin(req, res) {
  const credentials = req.body;
  const user = await req.services.user.getByEmail(credentials.email);
  if (!(await user.comparePassword(credentials.password))) {
    throw new UnauthorizedError(messages.users.loginError);
  }

  const payload = filterObj(user, [["_id", "id"], "email", "subscription"]);

  const token = jwt.sign(payload, settings.authentication.jwtSecret, {
    expiresIn: settings.authentication.jwtLifetime,
  });
  await req.services.user.updateById(user.id, { token });
  res.json({
    token,
    user: filterObj(user, ["email", "subscription", ["avatarURL", "avatar"]]),
  });
}

/** @type {RequestHandler} */
async function signout(req, res) {
  await req.services.user.updateById(req.user.id, { token: null });

  // Clearing the req.user just to be on the safer side
  delete req.user;

  res.status(204).end();
}

/** @type {RequestHandler} */
async function getCurrent(req, res) {
  const user = await req.services.user.getById(req.user.id);
  res.json(filterObj(user, ["email", "subscription", ["avatarURL", "avatar"]]));
}

/** @type {RequestHandler} */
async function changeSubscription(req, res) {
  const id = req.user.id;
  const { subscription } = req.body;
  const user = await req.services.user.updateById(id, { subscription });
  req.user.subscription = subscription;
  res.json({
    user: filterObj(user, ["email", "subscription", ["avatarURL", "avatar"]]),
  });
}

/** @type {RequestHandler} */
async function updateAvatar(req, res) {
  const id = req.user.id;
  const { subscription } = req.body;
  const user = await req.services.user.updateById(id, { subscription });
  req.user.subscription = subscription;
  res.json({
    user: filterObj(user, ["email", "subscription", ["avatarURL", "avatar"]]),
  });
}

/**
 * Filters object by the list of allowed keys
 * @param {any} obj - an object to filter
 * @param {Array.<string|string[]>} keyList - an array of keys. Items can be strings denoting key names. They can also be pairs like "orignalKeyName destinationKeyName" or [originalKeyName, destinationKeyName]. For example "_id id" or ["_id", "id"].
 */
function filterObj(obj, keyList) {
  return keyList
    .map((key) => (Array.isArray(key) ? key : key.split(" ")))
    .reduce((res, key) => ({ ...res, [key.at(-1)]: obj[key[0]] }), {});
}

module.exports = {
  signup,
  signin,
  signout,
  getCurrent,
  changeSubscription,
  updateAvatar,
};
