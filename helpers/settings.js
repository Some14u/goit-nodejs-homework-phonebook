require("dotenv").config();
const bytes = require("bytes");

module.exports = {
  isDev: process.env.NODE_ENV === "development",
  serverPort: process.env.PORT || 3000,
  databaseConnectionString: process.env.MONGODB_URL,
  authentication: {
    jwtSecret: process.env.JWT_SECRET,
    jwtLifetime: process.env.JWT_LIFETIME || "1m",
  },
  defaultPageSize: process.env.DEFAULT_PAGE_SIZE || 10,
  files: {
    publicFolder: process.env.PUBLIC_FOLDER || "public",
    tempFolder: process.env.TEMP_FOLDER || "temp",
  },
  avatar: {
    folder: process.env.AVATAR_FOLDER || "avatars",
    size: Number(process.env.AVATAR_SIZE) || 250,
    supportedFormats: JSON.parse(process.env.AVATAR_FORMATS) || [".jpg"],
    maxFileSize: bytes(process.env.AVATAR_MAX_FILE_SIZE) || 3 * 1024 * 1024,
  },
};
