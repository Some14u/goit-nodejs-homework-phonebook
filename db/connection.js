const mongoose = require("mongoose");

async function connectMongoDB() {
  await mongoose //
    .set("strictQuery", false)
    .connect(process.env.MONGODB_URL);
}

module.exports = {
  connectMongoDB,
};
