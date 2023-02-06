require("dotenv").config();

module.exports = {
  serverPort: process.env.PORT || 3000,
  databaseConnectionString: process.env.MONGODB_URL,
  authentication: {
    jwtSecret: process.env.JWT_SECRET,
    jwtLifetime: process.env.JWT_LIFETIME || "1m",
  },
  defaultPageSize: process.env.DEFAULT_PAGE_SIZE || 10,
};
