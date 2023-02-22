const fs = require("fs/promises");
const path = require("path");
const gravatar = require("gravatar");
const jimp = require("jimp");
const settings = require("../helpers/settings");

/** This takes the email as parameter and generates the url to default avatar image */
function getUrlByEmail(email) {
  return gravatar.url(email, {
    protocol: "https",
    d: "mp",
    s: settings.avatar.size,
  });
}

/**
 * Function rescales the image to specific **size** and then moves
 * the outcome to the destination folder.
 *
 * Both source and destination paths should include filename.
 * @param {string} source - path to file to process
 * @param {string} destination - path where the result would be stored
 * @param {number} size - dimension of the avatar. It will be shaped to square and cropped/scaled to this dimensions
 */
async function resizeAndMove(source, destination, size) {
  const file = await jimp.read(source);
  await file.cover(size, size).writeAsync(destination);

  // Delete the file at the source path
  await fs.unlink(source);
}

/**
 * Deletes the avatar file in public folder by it's relative url.
 *
 * This is used to remove old avatar files from public folder
 * after the new file was uploaded.
 *
 * Note, that the function doesn't throw anything when there is no file to delete.
 * @param {string} url - url address of the file. This can be relative or absolute. In case of absolute the function does nothing.
 */
async function deleteByUrl(url) {
  if (!url) return;
  const avatarURL = new URL(url, "file:");

  // This is the case for default avatar url provided by gravatar
  if (avatarURL.protocol !== "file:") return;

  // Build a path to the file
  const avatarPath = path.join(
    path.resolve(settings.folders.public),
    avatarURL.pathname
  );

  // "Silent" delete. Doesn't throw anything if there is no file
  try {
    await fs.unlink(avatarPath);
  } catch {}
}

module.exports = {
  getUrlByEmail,
  resizeAndMove,
  deleteByUrl,
};
