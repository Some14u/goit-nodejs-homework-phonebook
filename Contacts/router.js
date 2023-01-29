const express = require("express");
const router = express.Router();

const { createValidatorMiddleware } = require("../helpers");
const { validateJoi } = require("./model");
const { MissingFieldsError } = require("../helpers/errors");

const handlers = require("./controller");

// Modify handlers to make sure they will intercept errors
require("../helpers/errors").wrapWithErrorHandling(handlers);

// Build two types of validators: id and contact
const idValidator = createValidatorMiddleware("params", validateJoi, ["id"]);
const contactValidator = createValidatorMiddleware("body", validateJoi);

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

router //
  .route("/")
  .get(handlers.listContacts)
  .post(contactValidator, handlers.addContact);
router //
  .route("/:id")
  .get(idValidator, handlers.getContactById)
  .delete(idValidator, handlers.removeContact)
  .put(
    idValidator,
    putMissingFieldsValidator,
    contactValidator,
    handlers.updateContact
  );

module.exports = router;
