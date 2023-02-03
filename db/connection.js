const mongoose = require("mongoose");
const { databaseConnectionString: databaseUrl } = require("../helpers/settings");

async function connectMongoDB() {
  await mongoose //
    .set("strictQuery", false)
    .connect(databaseUrl);
}

module.exports = {
  connectMongoDB,
};
