const express = require("express");
const router = express.Router();

const handlers = require("./controller");

const validators = require("./validators");

const { wrapWithErrorHandling } = require("../helpers/errors");

// Modify handlers and validators to make sure they will intercept errors
wrapWithErrorHandling(handlers);
wrapWithErrorHandling(validators);

router //
  .route("/")
  .get(handlers.listContacts)
  .post(validators.contactValidator, handlers.addContact);
router //
  .route("/:id")
  .get(validators.idValidator, handlers.getContactById)
  .delete(validators.idValidator, handlers.removeContact)
  .put(
    validators.idValidator,
    validators.putMissingFieldsValidator,
    validators.contactValidator,
    handlers.updateContact
  );
router //
  .route("/:id/favorite")
  .patch(
    validators.idValidator,
    validators.favoriteValidator,
    handlers.updateContactStatus
  );

module.exports = router;
