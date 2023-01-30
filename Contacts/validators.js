const messages = require("../helpers/messages");
const { MissingFieldsError } = require("../helpers/errors");
const { createValidatorMiddleware } = require("../helpers/validation");
const Contact = require("./model");

// Build two types of validators: id and contact
const idValidator = createValidatorMiddleware("params", Contact.validateJoi);
const contactValidator = createValidatorMiddleware(
  "body",
  Contact.validateJoi,
  ["+ALL", "-id", "-favorite"]
);

/**
 * This stupid special case validator is required by the task rules.
 * It works flawlessly without it, simply throwing an error if any field is missing
 */
const putMissingFieldsValidator = createValidatorMiddleware(
  "body",
  ({ name, email, phone }) => {
    if (!name && !email && !phone) throw new MissingFieldsError();
  }
);

/** favorite patch validation */
const favoriteValidator = createValidatorMiddleware("body", (body) => {
  // This check is here because of task requirements.
  if (!body.favorite) throw new MissingFieldsError(messages.missingFavorite);
  // This basically does the same but with joi builtin error message
  Contact.validateJoi(body, ["+favorite"]);
});

module.exports = {
  idValidator,
  contactValidator,
  putMissingFieldsValidator,
  favoriteValidator,
};
