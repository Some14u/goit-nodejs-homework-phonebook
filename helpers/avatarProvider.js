const gravatar = require("gravatar");
const settings = require("./settings");
const jimp = require("jimp");

/** This takes the email as parameter and generates the url to default avatar image */
function getUrlByEmail(email) {
  return gravatar.url(email, {
    protocol: "https",
    d: "mp",
    s: settings.avatar.size,
  });
}

/**
 * Function rescales the image to specific **size** and then copy
 * the outcome to the destination folder.
 *
 * Both source and destination paths should include filename.
 * @param {string} source - path to file to process
 * @param {string} destination - path where the result would be stored
 * @param {number} size - dimension of the avatar. It will be shaped to square and cropped/scaled to this dimensions
 */
async function resizeAndSave(source, destination, size) {
  const file = await jimp.read(source);
  await file.cover(size, size).writeAsync(destination);
}

module.exports = {
  getUrlByEmail,
  resizeAndSave,
};
