const sgMail = require("@sendgrid/mail");
const messages = require("../../helpers/messages");
const settings = require("../../helpers/settings");

sgMail.setApiKey(settings.mailer.sendgrid.key);

/** Sends an email using sendGrid api */
async function send(from, to, subject, html) {
  const info = await sgMail.send({ from, to, subject, html });

  if (settings.isDev) console.log(messages.emailVerification.sent);
  return info;
}

module.exports = {
  send,
};
