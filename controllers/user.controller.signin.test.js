const supertest = require("supertest");
const server = require("../server");
const { MongoMemoryServer } = require("mongodb-memory-server");

const { signin } = require("./user.controller");
const db = require("../db/db");
const settings = require("../helpers/settings");
const { default: mongoose } = require("mongoose");
const User = require("../models/user.model");

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
  const user = {
    email: "test@email.com",
    password: "testPassword",
    token: "sometoken",
  };
  let memoryServer;

  async function initInMemoryServer() {
    memoryServer = await MongoMemoryServer.create();
  }

  async function stopInMemoryServer() {
    memoryServer.stop();
  }

  beforeAll(async () => {
    await initInMemoryServer();
    await db.connect(memoryServer.getUri);
  });

  afterAll(async () => {
    if (!memoryServer) return;
    await db.disconnect();
    await stopInMemoryServer();
  });

  beforeEach(async () => {
    await db.dropCollections();
  });

  it("should respond with status 200", async () => {
    User.create(user);
    // const response = await supertest(server.instance)
    // .post("/users/login")
    // .send({ email: user.email, password: user.password });
    // expect(response.statusCode).toEqual(200);
    const user = await User.findOne();

    expect(user).toBe();
  });
});
