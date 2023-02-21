const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const settings = require("../helpers/settings");
const { UnsupportedMediaError } = require("../helpers/errors");
const messages = require("../helpers/messages");

const { supportedFormats, maxFileSize } = settings.avatar;

// Configuring multer storage
const storage = multer.diskStorage({
  destination: path.resolve(process.cwd(), settings.files.tempFolder),
  filename: (_, file, cb) => {
    cb(null, crypto.randomUUID() + path.extname(file.originalname));
  },
});

/** Generic multer middleware for a single file */
const avatarHandler = multer({
  storage,
  limits: {
    fileSize: maxFileSize,
    files: 1, // Only one file allowed
    fields: 0, // No additional fields allowed
  },
  // This validates incoming file format
  fileFilter: (_, file, cb) => {
    const extension = path.extname(file.originalname);
    console.log(extension);
    if (supportedFormats.includes(extension)) {
      cb(null, true);
      return;
    }
    cb(
      new UnsupportedMediaError(
        messages.users.unsupportedAvatarFormat(supportedFormats)
      )
    );
  },
}).single("avatar");

/**
 * This middleware validates and uploads user avatar
 * @type {import("express").RequestHandler}
 */
function handleAvatarUpload(req, res, next) {
  // For some reason multer doesn't have a dedicated error/option for this case
  if (!req.is("multipart/form-data")) {
    const contentType = req.get("content-type");
    throw new UnsupportedMediaError(messages.unsupportedFormat(contentType));
  }

  // Call multer handler
  avatarHandler(req, res, (err) => {
    fixErrorMessages(err);
    next(err);
  });
}

/** Helper to customize default multer error messages */
function fixErrorMessages(err) {
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
    err.message += `. The maximum size allowed is ${maxFileSize} bytes.`;
  }
}

module.exports = handleAvatarUpload;
