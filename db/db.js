const mongoose = require("mongoose");
const messages = require("../helpers/messages");

/** @type {mongoose} */
let instance;

/**
 * Connects to the database
 * @param {string} databaseConnectionString - a database connection string. The format might be the following: mongodb+srv://userName:password@urlToDb/dbName
 */
async function connect(databaseConnectionString) {
  instance = await mongoose
    .set("strictQuery", false)
    .connect(databaseConnectionString);
  console.log(messages.database.connected);
  return instance;
}

async function disconnect() {
  if (!instance) return;
  await instance.connection.close();
}

async function dropCollections() {
  if (!instance) return;
  const collections = await instance.connection.db.collections();
  collections.forEach(async (collection) => {
    await collection.drop();
  });
}

module.exports = {
  instance,
  connect,
  disconnect,
  dropCollections,
};
