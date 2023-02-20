const gravatar = require("gravatar");
const settings = require("./settings");

// TODO: Description
function getUrlByEmail(email) {
  return gravatar.url(email, {
    protocol: "https",
    d: "mp",
    s: settings.avatar.size,
  });
}

module.exports = {
  getUrlByEmail,
};
