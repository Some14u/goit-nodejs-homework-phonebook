require("dotenv").config();

module.exports = {
  isDev: process.env.NODE_ENV === "development",
  serverPort: process.env.PORT || 3000,
  databaseConnectionString: process.env.MONGODB_URL,
  authentication: {
    jwtSecret: process.env.JWT_SECRET,
    jwtLifetime: process.env.JWT_LIFETIME || "1m",
  },
  defaultPageSize: process.env.DEFAULT_PAGE_SIZE || 10,
  avatarSize: process.env.AVATAR_SIZE || 250,
  files: {
    publicFolder: process.env.PUBLIC_FOLDER || "public",
    tempFolder: process.env.TEMP_FOLDER || "temp",
  },
};
