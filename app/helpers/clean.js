/*
 * This module is used as "clean" package.json script and will clear
 * the content of public and temp folders.
 * Actual names for these folders are taken from the .env file.
 *
 * The "clean" script is used by git pre-commit hook (.githooks/pre-commit).
 * It is possible to control whether to run the script upon git commit
 * or not, by setting the CLEAN_ON_COMMIT option in .env file.
 */

const fs = require("fs/promises");
const path = require("path");
const { folders } = require("./settings");

/** Deletes content of the folder */
async function clearFolder(folder) {
  console.log(`Clearing \x1b[33m${folder}\x1b[0m folder...`);
  try {
    const files = await fs.readdir(folder);
    if (!files.length) {
      console.log("Nothing to delete. Skipping.");
      return;
    }
    await Promise.all(files.map((file) => fs.unlink(path.join(folder, file))));
    console.log(`Done. Deleted ${files.length} files.`);
  } catch (err) {
    console.error(`Error while clearing ${folder} folder: ${err.message}`);
  }
}

(async function () {
  await clearFolder(path.posix.join(folders.public, folders.avatars));
  console.log();
  await clearFolder(folders.temp);
})();
