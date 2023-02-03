const { serverPort: port } = require("./helpers/settings");

const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const contactsRouter = require("./Contacts/router");
const usersRouter = require("./Users/router");

const messages = require("./helpers/messages");
const errors = require("./helpers/errors");

const { connectMongoDB } = require("./db/connection");
const requestContext = require("./requestContext");

connectMongoDB()
  .then(() => console.log(messages.databaseConnected))
  .catch(errors.showErrorAndStopApp("databaseError"))
  .then(startServer)
  .catch(errors.showErrorAndStopApp("unhandledError"));

function startServer() {
  const app = express();
  const formatsLogger = app.get("env") === "development" ? "dev" : "short";

  app
    .use(logger(formatsLogger))
    .use(cors())
    .use(express.urlencoded({ extended: false }))
    .use(express.json())

    .use(requestContext.provideHandler()) // Used to store user credentials

    .use("/api/contacts", contactsRouter)
    .use("/users", usersRouter)

    .use(errors.globalNotFoundHandler)
    .use(errors.globalErrorHandler)

    .listen(port, () => console.log(messages.serverRunning(port)))
    .on("error", errors.showErrorAndStopApp("unhandledError"));
}
