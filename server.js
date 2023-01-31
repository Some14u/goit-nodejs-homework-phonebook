require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const contactsRouter = require("./Contacts/router");

const messages = require("./helpers/messages");
const {
  globalErrorHandler,
  showErrorAndStopApp,
  notFoundHandler,
} = require("./helpers/errors");

const { connectMongoDB } = require("./db/connection");

connectMongoDB()
  .then(() => console.log(messages.databaseConnected))
  .catch(showErrorAndStopApp("databaseError"))
  .then(startServer)
  .catch(showErrorAndStopApp("unhandledError"));

function startServer() {
  const app = express();
  const formatsLogger = app.get("env") === "development" ? "dev" : "short";
  const port = process.env.PORT || 3000;

  app
    .use(logger(formatsLogger))
    .use(cors())
    .use(express.urlencoded({ extended: false }))
    .use(express.json())

    .use("/api/contacts", contactsRouter)

    .use(notFoundHandler)
    .use(globalErrorHandler)

    .listen(port, () => console.log(messages.serverRunning(port)))
    .on("error", showErrorAndStopApp("unhandledError"));
}
