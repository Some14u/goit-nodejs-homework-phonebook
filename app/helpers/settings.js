require("dotenv").config();
const bytes = require("bytes");

const avatarsFolder = process.env.AVATAR_FOLDER || "avatars";
const appName = process.env.npm_package_name;
const domain = process.env.DOMAIN;

module.exports = {
  appName,
  isDev: process.env.NODE_ENV === "development",
  domain,
  serverPort: process.env.PORT || 3000,
  databaseConnectionString: process.env.MONGODB_URL,
  authentication: {
    jwt: {
      secret: process.env.JWT_SECRET,
      lifeTime: {
        auth: process.env.JWT_LIFETIME || "1m",
        emailVerification: process.env.JWT_EMAIL_LIFETIME || "1h",
      },
    },
    emailVerificationFrom: process.env.VERIFICATION_EMAIL_FROM,
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
  mailer: {
    engine: process.env.MAILER_ENGINE || "nodemailer",
    sendgrid: {
      key: process.env.SENDGRID_API_KEY,
    },
    nodemailer: {
      host: process.env.MAILER_SMTP_HOST,
      port: process.env.MAILER_SMTP_PORT,
      userName: process.env.MAILER_SMTP_USERNAME,
      password: process.env.MAILER_SMTP_PASSWORD,
    },
  },
};
