/** @typedef {import("express").RequestHandler} RequestHandler */
const service = require("./service");

/** @type {RequestHandler} */
const signup = async (req, res) => {
  const { email, password } = req.body;

  const contacts = await service.getAllOrThrow();
  res.json(contacts);
};

module.exports = {
  signup,
};
