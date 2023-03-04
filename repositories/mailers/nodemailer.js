const nodemailer = require("nodemailer");
const messages = require("../../helpers/messages");
const settings = require("../../helpers/settings");
const htmlToText = require("nodemailer-html-to-text").htmlToText;

let transporter;

(async () => {
  // Generate fake user account using https://ethereal.email
  const testAccount = await nodemailer.createTestAccount();

  // Create transporter object, which would send emails
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
    // Set default "from" string for any sended email
  });

  // Add html-to-text middleware
  transporter.use("compile", htmlToText());
})();

/** Sends an email using fake smtp server+user, provided by https://ethereal.email */
async function send(from, to, subject, html) {
  const info = await transporter.sendMail({ from, to, subject, html });

  // It is possible to view sended emails on https://ethereal.email + /something
  // transporter.getTestMessageUrl provides exact url address for email, represented by "info"
  if (settings.isDev) {
    console.log(
      messages.users.emailVerification.sentEmailPreview(
        transporter.getTestMessageUrl(info)
      )
    );
  }
  return info;
}

module.exports = {
  send,
};
