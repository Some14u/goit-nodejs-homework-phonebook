const mongoose = require("mongoose");
const { databaseConnectionString } = require("../helpers/settings");

async function connectMongoDB() {
  await mongoose //
    .set("strictQuery", false)
    .connect(databaseConnectionString);
}

module.exports = connectMongoDB;
