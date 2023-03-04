const fs = require("fs");
const path = require("path");
const { URL } = require("url");
const handlebars = require("handlebars");
const messages = require("../helpers/messages");
const settings = require("../helpers/settings");
const mailer = require("../repositories/mailer.repo");

class EmailService {
  from;
  verificationEmail;

  constructor(from) {
    this.from = from;
    this.templates = {
      confirmation: this.#loadTemplate("validation"),
    };
  }

  sendConfirmationEmail(userEmail, token) {
    const context = {
      appName: settings.appName,
      confirmationUrl: this.#buildConfirmationUrl(token),
    };

    return mailer.send(
      this.from,
      userEmail,
      messages.users.emailVerification.subject,
      this.templates.confirmation(context)
    );
  }

  #loadTemplate(name) {
    const filePath = path.join(process.cwd(), "views/emails", name + ".hbs");
    const data = fs.readFileSync(filePath, "utf8");
    return handlebars.compile(data);
  }

  #buildConfirmationUrl(token) {
    const url = new URL();
    url.hostname = settings.isDev ? "localhost" : settings.domain;
    url.pathname = "api/user/verify/" + token;
    if (settings.isDev) url.port = settings.port;
    return url.href;
  }
}

const emailService = new EmailService(
  // Set default "from" string for any sended email
  settings.authentication.emailConfirmationFrom
);

module.exports = emailService;
