const gravatar = require("gravatar");

// TODO: Description
function getUrlByEmail(email) {
  return gravatar.url(email);
}

module.exports = {
  getUrlByEmail,
};
