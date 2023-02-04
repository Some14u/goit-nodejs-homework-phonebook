/** @typedef {import("express").RequestHandler} RequestHandler */
const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../helpers/errors");
const messages = require("../helpers/messages");
const settings = require("../helpers/settings");
const User = require("./model");
const request = require("../requestContext");

/** @type {RequestHandler} */
async function signup(req, res) {
  const { email, subscription } = await User.create(req.body);
  res.status(201).json({ user: { email, subscription } });
}

/** @type {RequestHandler} */
async function signin(req, res) {
  const credentials = req.body;
  const user = await User.getByEmail(credentials.email);

  if (!(await user.comparePassword(credentials.password))) {
    throw new UnauthorizedError(messages.users.loginError);
  }
  const payload = {
    id: user._id,
    email: user.email,
    subscription: user.subscription,
  };

  user.token = jwt.sign(payload, settings.authentication.jwtSecret, {
    expiresIn: settings.authentication.jwtLifetime,
  });
  user.save();
  res.json({ token: user.token, user: credentials });
}

/** @type {RequestHandler} */
async function signout(_, res) {
  User.findByIdAndUpdate(request.context.user.id, { token: null });

  // Clearing the context just to be on the safer side
  delete request.context.user;
  res.status(204).end();
}

module.exports = {
  signup,
  signin,
  signout,
};
