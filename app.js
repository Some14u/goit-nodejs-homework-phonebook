const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const contactsRouter = require("./Contacts/router");
const { errorHandler } = require("./helpers/errors");
const { notFoundHandler } = require("./helpers");

const fsApi = require("./db/fsApi");
const Contact = require("./Contacts/model");

fsApi.init(Contact, "./db/contacts.json");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app
  .use(logger(formatsLogger))
  .use(cors())
  .use(express.urlencoded({ extended: false }))
  .use(express.json())

  .use("/api/contacts", contactsRouter)

  .use(notFoundHandler)
  .use(errorHandler);

module.exports = app;
