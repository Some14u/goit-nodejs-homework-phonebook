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
    emailInUse: "Email in use",
    signinError: "Email or password is wrong",
    notAuthorized: "Not authorized",
    unsupportedAvatarFormat: (formats) =>
      `Unsupported file type. Use one of the following formats: ${formats.join(
        ", "
      )}`,
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
};

module.exports = messages;
