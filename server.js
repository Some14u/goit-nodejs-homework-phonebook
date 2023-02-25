const settings = require("./helpers/settings");
const messages = require("./helpers/messages");
const errors = require("./helpers/errors");

const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const db = require("./db/db");

const contactsRouter = require("./routers/contact.router");
const usersRouter = require("./routers/user.router");

const instantiateServices = require("./middlewares/services.middleware");

const formatsLogger = settings.isDev ? "dev" : "short";

const instance = express()
  .use(logger(formatsLogger))
  .use(cors())
  .use(express.urlencoded({ extended: false }))
  .use(express.json())

  .use(express.static(settings.folders.public))

  .use(instantiateServices)

  .use("/api/contacts", contactsRouter)
  .use("/users", usersRouter)

  .use(errors.globalNotFoundHandler)
  .use(errors.globalErrorHandler);

async function start() {
  if (!instance) throw new Error(messages.server.noServerInstance);

  await db.connect(settings.databaseConnectionString);

  return instance
    .listen(settings.serverPort, () =>
      console.log(messages.server.isRunning(settings.serverPort))
    )
    .on("error", errors.showErrorAndStopApp(messages.unhandledError));
}

/** @param {import('http').Server} instance */
async function stop(instance, cb) {
  if (!instance) cb?.(new Error(messages.server.noServerInstance));
  if (!instance?.close) cb?.(new Error(messages.server.isNotRunning));

  instance?.close?.(async (err) => {
    await db.disconnect();
    cb?.(err);
  });
}

module.exports = {
  instance,
  start,
  stop,
};
