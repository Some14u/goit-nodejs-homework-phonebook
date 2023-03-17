// List of all possible custom messages
const messages = {
  contacts: {
    exist: (name) => `There is another contact with "name" = "${name}"`,
    missingFavorite: "missing field favorite",
    deleted: "Contact deleted",
    mongoNoName: "Set name for contact",
  },
  users: {
    mongoPasswordRequired: "Password is required",
    mongoEmailRequired: "Email is required",
    avatarRequired: '"avatar" is required',
    emailInUse: "Email in use",
    signinError: "Email or password is wrong",
    notAuthorized: "Not authorized",
    noVerifyToken: "Verify token is required",
    unsupportedAvatarFormat: (formats) =>
      `Unsupported file type. Use one of the following formats: ${formats.join(
        ", "
      )}`,
  },
  emailVerification: {
    successful: "Verification successful",
    info: (email) =>
      `An email verification procedure is requred in order to complete the registration.\nCheck ${email} for our verification request.`,
    sent: "Verification email sent",
    beenPassed: "Verification has already been passed",
    wrongToken: "This token not exist or has been expired",
    sentEmailPreview: (url) => "Preview url: " + url,
    subject: (appName) => `${appName} email verification`,
    notVerifiedEmail: `User with these credentials has not verified his email yet.\nYou can resend email verification request using POST /users/verify with "email" key in the body.`,
  },
  server: {
    isRunning: (port) => "Server is running. Use our API on port " + port,
    isNotRunning: "Server is not running",
    noServerInstance: "No server instance provided",
  },
  database: {
    connected: "Database connection successful",
    unhandledError: (error) => "Error connecting database:\n" + error,
  },
  unsupportedFormat: (actualFormat) =>
    `"Unsupported request payload format. Expected "multipart/form-data", got "${actualFormat}"`,
  unhandledError: (error) =>
    "Something went wrong. Unable to continue.\n" + error,
  notFound: "Not found",
  missingFields: "Missing fields",
  mailerMessage: (mailer) => `Using ${mailer} engine to send emails`,
};

module.exports = messages;
