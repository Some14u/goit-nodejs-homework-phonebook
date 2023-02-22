/** @typedef {import("../helpers/types").RequestHandler} RequestHandler */
const { filterObj } = require("../helpers/tools");

/** @type {RequestHandler} */
async function signup(req, res) {
  const { email, subscription } = await req.services.user.add(req.body);
  res.status(201).json({ user: { email, subscription } });
}

/** @type {RequestHandler} */
async function signin(req, res) {
  const { email, password } = req.body;
  const user = await req.services.user.login(email, password);
  res.json({
    token: user.token,
    user: filterObj(user, ["email", "subscription", "avatarURL"]),
  });
}

/** @type {RequestHandler} */
async function signout(req, res) {
  await req.services.user.updateById(req.user.id, { token: null });
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
