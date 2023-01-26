const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const { initDB } = require("./repositories/contacts");
initDB("./db/contacts.json");

const contactsRouter = require("./routes/api/contactsRoute");
const { errorHandler } = require("./helpers");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";


app.use(logger(formatsLogger));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use(errorHandler);

module.exports = app;
