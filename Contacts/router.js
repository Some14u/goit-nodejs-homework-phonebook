const express = require("express");
const router = express.Router();

const handlers = require("./controller");

const {
  contactValidator,
  idValidator,
  putMissingFieldsValidator,
  favoriteValidator,
} = require("./validators");

// Modify handlers to make sure they will intercept errors
require("../helpers/errors").wrapWithErrorHandling(handlers);

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
router //
  .route("/:id/favorite")
  .patch(idValidator, favoriteValidator, handlers.updateContactStatus);

module.exports = router;
