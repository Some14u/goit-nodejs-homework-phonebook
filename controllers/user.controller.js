/** @typedef {import("../helpers/types").RequestHandler} RequestHandler */
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const { URL } = require("url");
const path = require("path");
const settings = require("../helpers/settings");
const messages = require("../helpers/messages");
const { resizeAndSave } = require("../helpers/avatarProvider");
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

/**
 * Handles new avatar uploading.
 * @type {RequestHandler}
 */
async function updateAvatar(req, res) {
  const id = req.user.id;

  // Setup source and destination paths
  const source = req.file.path;
  const relative = path.join(settings.avatar.folder, req.file.filename);
  const avatarURL = new URL("file:" + relative).pathname;
  const destination = path.resolve(settings.files.publicFolder, relative);

  // Process the image, move it to the public folder and wipe out from tmp
  await resizeAndSave(source, destination, settings.avatar.size);
  await fs.unlink(source);
  await deleteOldAvatar(req.user.avatarURL);

  await req.services.user.updateById(id, { avatarURL });
  req.user.avatarURL = avatarURL;

  res.json({ avatarURL });
}

async function deleteOldAvatar(avatarPath) {
  if (!avatarPath) return;
  avatarPath = new URL(avatarPath, "file:");

  // This is the case for default avatar url provided by gravatar
  if (avatarPath.protocol !== "file:") return;

  // Build a path to the old file
  avatarPath = path.join(
    path.resolve(settings.files.publicFolder),
    avatarPath.pathname
  );

  // "Silent" delete. Doesn't throw anything if there is no file
  try {
    await fs.unlink(avatarPath, () => {});
  } catch {}
}

module.exports = {
  signup,
  signin,
  signout,
  getCurrent,
  changeSubscription,
  updateAvatar,
};
