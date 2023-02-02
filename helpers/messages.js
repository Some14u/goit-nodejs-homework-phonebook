// List of all possible custom messages
const messages = {
  notFound: "Not found",
  exist: (name) => `There is another contact with "name" = "${name}"`,
  missingFields: "Missing fields",
  missingFavorite: "missing field favorite",
  deleted: "Contact deleted",
  mongooseNoName: "Set name for contact",
  serverRunning: (port) => "Server is running. Use our API on port " + port,
  databaseConnected: "Database connection successful",
  databaseError: (error) =>
    "Error connecting database. Unable to continue.\n" + error,
  unhandledError: (error) =>
    "Something went wrong. Unable to continue.\n" + error,
  users: {
    passwordRequired: "Password is required",
    emailRequired: "Email is required",
    emailInUse: "Email in use",
  },
};

module.exports = messages;
