const mongoose = require("mongoose");
const errors = require("../helpers/errors");
const messages = require("../helpers/messages");
const { databaseConnectionString } = require("../helpers/settings");

function connectMongoDB() {
  return mongoose //
    .set("strictQuery", false)
    .connect(databaseConnectionString)
    .then(() => console.log(messages.databaseConnected))
    .catch(errors.showErrorAndStopApp("databaseError"));
}

module.exports = connectMongoDB;
