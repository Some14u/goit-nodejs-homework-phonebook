/** @typedef {import("express").RequestHandler} RequestHandler */
const service = require("./service");

/** @type {RequestHandler} */
const signup = async (req, res) => {
  const { email, password } = req.body;
  service.setUserId("first");
  console.log("signup before", service.getUserId());
  await new Promise((resolve) => setTimeout(resolve, 10000));
  console.log("signup after", service.getUserId());
  // const contacts = await service.getAllOrThrow();
  res.json();
};

/** @type {RequestHandler} */
const signin = async (req, res) => {
  const { email, password } = req.body;
  console.log("login", service.getUserId());
  service.setUserId("second");
  console.log("login", service.getUserId());
  res.json();
};

module.exports = {
  signup,
  signin,
};
