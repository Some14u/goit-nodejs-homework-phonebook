const express = require("express");
const router = express.Router();

const service = require("../services/contacts");
const handlers = require("./common").wrapWithHandlers(service);

router //
  .route("/")
  .get(handlers.getAll)
  .post(handlers.add);
router //
  .route("/:id")
  .get(handlers.getById)
  .delete(handlers.remove)
  .put(handlers.update);

module.exports = router;
