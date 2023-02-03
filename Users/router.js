const express = require("express");
const router = express.Router();

const handlers = require("./controller");
const validators = require("./validators");

const { wrapWithErrorHandling } = require("../helpers/errors");

// Modify handlers and validators to make sure they will intercept errors
wrapWithErrorHandling(handlers);
wrapWithErrorHandling(validators);

router //
  .route("/signup")
  .post(validators.credentialsValidator, handlers.signup);
router //
  .route("/login")
  .post(validators.credentialsValidator, handlers.signin);

module.exports = router;
