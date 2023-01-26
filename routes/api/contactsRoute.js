const express = require("express");
const router = express.Router();

const handlers = require("../../controllers/contactsController");

// Modify handlers to make sure they will intercept errors
require("../../helpers").wrapWithErrorHandling(handlers);

router //
  .route("/")
  .get(handlers.listContacts)
  .post(handlers.addContact);
router //
  .route("/:id")
  .get(handlers.getContactById)
  .del(handlers.removeContact)
  .put(handlers.updateContact);

module.exports = router;
