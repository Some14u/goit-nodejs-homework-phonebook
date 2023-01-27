const express = require("express");
const router = express.Router();

const handlers = require("../../controllers/contacts");
const { createValidatorMiddleware } = require("../../helpers");
const { validate } = require("../../models/contact");

// Modify handlers to make sure they will intercept errors
require("../../helpers").wrapWithErrorHandling(handlers);

// Build two types of validators: id and contact
const idValidator = createValidatorMiddleware("params", validate, ["id"]);
const contactValidator = createValidatorMiddleware("body", validate, [
  "name",
  "email",
  "phone",
]);

router //
  .route("/")
  .get(handlers.listContacts)
  .post(contactValidator, handlers.addContact);
router //
  .route("/:id")
  .get(idValidator, handlers.getContactById)
  .del(idValidator, handlers.removeContact)
  .put(idValidator, contactValidator, handlers.updateContact);

module.exports = router;
