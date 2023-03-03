require("dotenv").config();
const bytes = require("bytes");

const avatarsFolder = process.env.AVATAR_FOLDER || "avatars";

module.exports = {
  isDev: process.env.NODE_ENV === "development",
  serverPort: process.env.PORT || 3000,
  databaseConnectionString: process.env.MONGODB_URL,
  authentication: {
    jwt: {
      secret: process.env.JWT_SECRET,
      lifeTime: {
        auth: process.env.JWT_LIFETIME || "1m",
        emailConfirmation: process.env.JWT_EMAIL_LIFETIME || "1h",
      },
    },
  },
  defaultPageSize: process.env.DEFAULT_PAGE_SIZE || 10,
  folders: {
    public: process.env.PUBLIC_FOLDER || "public",
    temp: process.env.TEMP_FOLDER || "temp",
    avatars: avatarsFolder,
  },
  avatar: {
    folder: avatarsFolder,
    size: Number(process.env.AVATAR_SIZE) || 250,
    supportedFormats: process.env.AVATAR_FORMATS.split(" ") || [".jpg"],
    maxFileSize: bytes(process.env.AVATAR_MAX_FILE_SIZE) || 3 * 1024 * 1024,
  },
};
