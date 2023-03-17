const express = require("express");
const router = express.Router();

const handlers = require("../controllers/contact.controller");
const validators = require("../validators/contact.validators");

const { wrapWithErrorHandling } = require("../helpers/errors");
const authGate = require("../middlewares/auth.middleware");
const assignOwnerIdToService = require("../middlewares/contact.middleware");

// Modify handlers and validators to make sure they will intercept errors
wrapWithErrorHandling(handlers);
wrapWithErrorHandling(validators);

router
  // Check for credentials and take them to the request context
  .use(authGate)
  // Pass the userId to the service which is also stored in the request context
  .use(assignOwnerIdToService);

router
  .route("/")
  .get(validators.queryParamsValidation, handlers.listContacts)
  .post(validators.contactValidator, handlers.addContact);

router
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
    // Here we're using simple updateContact, because validators will
    // remove all extra parameters one could provide
    handlers.updateContact
  );

module.exports = router;
