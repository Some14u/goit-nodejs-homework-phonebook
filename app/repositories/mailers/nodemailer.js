const nodemailer = require("nodemailer");
const messages = require("../../helpers/messages");
const htmlToText = require("nodemailer-html-to-text").htmlToText;
const settings = require("../../helpers/settings");
const setup = settings.mailer.nodemailer;

let transporter;

(async () => {
  const tmpUser = setup.userName ? {} : await nodemailer.createTestAccount();

  // Create transporter object, which would send emails
  transporter = nodemailer.createTransport({
    host: setup.host || "smtp.ethereal.email",
    port: setup.port || 587,
    secure: false,
    auth: {
      user: setup.userName || tmpUser.user,
      pass: setup.password || tmpUser.pass,
    },
  });

  // Add html-to-text middleware
  transporter.use("compile", htmlToText());
})();

/** Sends an email using fake smtp server+user, provided by https://ethereal.email */
async function send(from, to, subject, html) {
  const info = await transporter.sendMail({ from, to, subject, html });

  if (settings.isDev) {
    console.log(messages.emailVerification.sent);

    // It is possible to view sended emails on https://ethereal.email + /something
    // nodemailer.getTestMessageUrl provides exact url address for email, represented by "info"
    const url = nodemailer.getTestMessageUrl(info);
    if (url) {
      console.log(messages.emailVerification.sentEmailPreview(url));
    }
  }
  return info;
}

module.exports = {
  send,
};
