const express = require("express");
const router = express.Router();

const handlers = require("../controllers/user.controller");
const validators = require("../validators/user.validators");

const { wrapWithErrorHandling } = require("../helpers/errors");
const authGate = require("../middlewares/auth.middleware");
const handleAvatarUpload = require("../middlewares/uploadAvatar.middleware");

// Modify handlers and validators to make sure they will intercept errors
wrapWithErrorHandling(handlers);
wrapWithErrorHandling(validators);
router //
  .route("/")
  .patch(
    authGate,
    validators.subscriptionValidator,
    handlers.changeSubscription
  );

router //
  .route("/signup")
  .post(validators.credentialsValidator, handlers.signup);

router //
  .route("/login")
  .post(validators.credentialsValidator, handlers.signin);

router //
  .route("/logout")
  .get(authGate, handlers.signout);

router //
  .route("/current")
  .get(authGate, handlers.getCurrent);

router //
  .route("/avatar")
  .patch(authGate, handleAvatarUpload, handlers.updateAvatar);

module.exports = router;
