/** @typedef {import("../helpers/types").RequestHandler} RequestHandler */
const jwt = require("jsonwebtoken");
const settings = require("../helpers/settings");
const messages = require("../helpers/messages");
const { UnauthorizedError } = require("../helpers/errors");
const { filterObj } = require("../helpers/tools");

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

  const payload = filterObj(user, [
    ["_id", "id"],
    "email",
    "subscription",
    "avatarURL",
  ]);

  const token = jwt.sign(payload, settings.authentication.jwtSecret, {
    expiresIn: settings.authentication.jwtLifetime,
  });
  await req.services.user.updateById(user.id, { token });
  res.json({
    token,
    user: filterObj(user, ["email", "subscription", "avatarURL"]),
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
  res.json(filterObj(user, ["email", "subscription", "avatarURL"]));
}

/** @type {RequestHandler} */
async function changeSubscription(req, res) {
  const id = req.user.id;
  const { subscription } = req.body;
  const user = await req.services.user.updateById(id, { subscription });
  req.user.subscription = subscription;
  res.json({
    user: filterObj(user, ["email", "subscription", "avatarURL"]),
  });
}

/** @type {RequestHandler} */
async function updateAvatar(req, res) {
  const id = req.user.id;
  const avatarURL = await req.services.user.updateAvatarById(id, req.file.path);
  req.user.avatarURL = avatarURL;
  res.json({ avatarURL });
}

module.exports = {
  signup,
  signin,
  signout,
  getCurrent,
  changeSubscription,
  updateAvatar,
};
