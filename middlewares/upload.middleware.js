const multer = require("multer");
const path = require("path");

const settings = require("../helpers/settings");

const storage = multer.diskStorage({
  destination: path.resolve(process.cwd(), settings.files.tempFolder),
});
