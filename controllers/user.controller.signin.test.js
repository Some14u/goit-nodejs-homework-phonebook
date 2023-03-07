const supertest = require("supertest");
const server = require("../server");
const { MongoMemoryServer } = require("mongodb-memory-server");
const db = require("../db/db");
const { signin } = require("./user.controller");
const settings = require("../helpers/settings");
const User = require("../models/user.model");
const messages = require("../helpers/messages");
const { filterObj } = require("../helpers/tools");
const jwt = require("../repositories/jwt.repo");

settings.isDev = true;

describe("signin unit test", () => {
  let mockRequest;
  const user = {
    email: "test@email.com",
    password: "testPassword",
    token: "sometoken",
    subscription: "pro",
  };

  // Define a mock response object
  const mockResponse = {
    json: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
  };

  beforeEach(() => {
    mockRequest = {
      body: {
        email: user.email,
        password: user.password,
      },
      services: { user: {} },
    };
  });

  it("should call service signin and return json with token", async () => {
    // Mocking the signin service fn which returns successful result
    mockRequest.services.user.signin = jest.fn().mockReturnValue(user);

    // Mocking the json responce
    const expectedResponse = {
      token: user.token,
    };

    await signin(mockRequest, mockResponse);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining(expectedResponse)
    );
  });

  it("should call service signin and return json with user, having email and subscription", async () => {
    // Mocking the signin service fn which returns successful result
    mockRequest.services.user.signin = jest.fn().mockReturnValue(user);

    // Mocking the json responce
    const expectedResponse = {
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    };

    await signin(mockRequest, mockResponse);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining(expectedResponse)
    );
  });

  it("should reject with error if service signin throws", async () => {
    // Mocking the signin service fn which throws an error
    mockRequest.services.user.signin = jest.fn(() => {
      throw new Error("An error occurred");
    });
    expect(signin(mockRequest, {})).rejects.toThrow();
  });
});

describe("signin integrational test", () => {
  const credentials = {
    email: "test@email.com",
    password: "testPassword",
  };
  let memoryServer;
  let user;

  beforeAll(async () => {
    memoryServer = await MongoMemoryServer.create();
    db.instance = await db.connect(memoryServer.getUri());
  });

  afterAll(async () => {
    if (!memoryServer) return;
    await db.disconnect();
    await memoryServer.stop();
  });

  beforeEach(async () => {
    await db.dropCollections();

    // Creating test user (and it's POJO)
    user = (await User.create(credentials)).toJSON();
    user._id = user._id.toString();
  });

  it("should respond with status 200 if credentials are ok", async () => {
    const response = await supertest(server.instance)
      .post("/users/login")
      .send({ email: credentials.email, password: credentials.password });

    expect(response.statusCode).toEqual(200);
  });

  it("should return token and user, having email and subscription, if credentials are ok", async () => {
    const response = await supertest(server.instance)
      .post("/users/login")
      .send({ email: credentials.email, password: credentials.password });

    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("user.email", credentials.email);
    expect(response.body).toHaveProperty(
      "user.subscription",
      User.SubscriptionTypes.starter
    );
  });

  it("should respond with status 401 and error message, if password is not ok", async () => {
    const response = await supertest(server.instance)
      .post("/users/login")
      .send({ email: credentials.email, password: "wrongPassword" });
    expect(response.statusCode).toEqual(401);
    expect(response.body).toEqual({ message: messages.users.signinError });
  });

  it("should respond with status 401 and error message, if email is not ok", async () => {
    const response = await supertest(server.instance)
      .post("/users/login")
      .send({ email: "unknown@email.com", password: credentials.password });
    expect(response.statusCode).toEqual(401);
    expect(response.body).toEqual({ message: messages.users.signinError });
  });

  it("should return valid JWT with expected data", async () => {
    const payload = filterObj(user, [["_id", "id"], "email", "subscription"]);

    const response = await supertest(server.instance)
      .post("/users/login")
      .send({ email: credentials.email, password: credentials.password });

    const decodedPayload = await jwt
      .verify(response.body.token)
      .catch((error) => error);

    expect(decodedPayload).toEqual(expect.objectContaining(payload));
  });
});
