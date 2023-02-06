// List of all possible custom messages
const messages = {
  notFound: "Not found",
  missingFields: "Missing fields",
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
    loginError: "Email or password is wrong",
    notAuthorized: "Not authorized",
  },
  serverRunning: (port) => "Server is running. Use our API on port " + port,
  databaseConnected: "Database connection successful",
  databaseError: (error) =>
    "Error connecting database. Unable to continue.\n" + error,
  unhandledError: (error) =>
    "Something went wrong. Unable to continue.\n" + error,
};

module.exports = messages;
