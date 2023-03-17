const messages = require("../helpers/messages");
const settings = require("../helpers/settings");

const mailer = {
  send: require(`./mailers/${settings.mailer.engine}`).send,
};

console.log(messages.mailerMessage(settings.mailer.engine));

module.exports = mailer;
