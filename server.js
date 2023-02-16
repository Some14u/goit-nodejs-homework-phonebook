const { serverPort: port, isDev } = require("./helpers/settings");

const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const contactsRouter = require("./routers/contact.router");
const usersRouter = require("./routers/user.router");

const messages = require("./helpers/messages");
const errors = require("./helpers/errors");

const connectMongoDB = require("./db/connection");
const instantiateServices = require("./middlewares/services.middleware");

connectMongoDB()
  .then(startServer)
  .catch(errors.showErrorAndStopApp(messages.unhandledError));

function startServer() {
  const app = express();
  const formatsLogger = isDev ? "dev" : "short";

  app
    .use(logger(formatsLogger))
    .use(cors())
    .use(express.urlencoded({ extended: false }))
    .use(express.json())

    .use(instantiateServices)

    .use("/api/contacts", contactsRouter)
    .use("/users", usersRouter)

    .use(errors.globalNotFoundHandler)
    .use(errors.globalErrorHandler)

    .listen(port, () => console.log(messages.serverRunning(port)))
    .on("error", errors.showErrorAndStopApp(messages.unhandledError));
}
