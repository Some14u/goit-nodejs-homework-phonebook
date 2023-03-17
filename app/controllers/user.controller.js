/** @typedef {import("../helpers/types").RequestHandler} RequestHandler */
const messages = require("../helpers/messages");
const { filterObj } = require("../helpers/tools");

/** @type {RequestHandler} */
async function signup(req, res) {
  const { email, subscription } = await req.services.user.signup(req.body);
  res.status(201).json({
    user: { email, subscription },
    message: messages.emailVerification.info(req.body.email),
  });
}

/** @type {RequestHandler} */
async function signin(req, res) {
  const { email, password } = req.body;
  const user = await req.services.user.signin(email, password);
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
async function activateAccount(req, res) {
  const { verificationToken } = req.params;
  await req.services.user.activateAccount(verificationToken);
  res.json({ message: messages.emailVerification.successful });
}

/** @type {RequestHandler} */
async function requestEmailVerificationToken(req, res) {
  const { email } = req.body;
  await req.services.user.reverifyEmail(email);
  res.json({ message: messages.emailVerification.sent });
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
  activateAccount,
  requestEmailVerificationToken,
  getCurrent,
  changeSubscription,
  updateAvatar,
};
