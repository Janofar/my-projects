const bcrypt = require("bcryptjs");
const { register } = require("../../userController");
const User = require("../../../models/User");
const Role = require("../../../models/Role");
const httpMocks = require("node-mocks-http");
const mockingoose = require("mockingoose");

describe("register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if the user already exists", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        roleName: "User",
      },
    });
    const res = httpMocks.createResponse();

    mockingoose(User).toReturn({ email: "test@example.com" }, "findOne");

    await register(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "User with this email already exists.",
    });
  });

  it("should return 400 if the role is not found", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: {
        name: "Test User",
        email: "newuser@example.com",
        password: "password123",
        roleName: "NonexistentRole",
      },
    });
    const res = httpMocks.createResponse();

    mockingoose(User).toReturn(null, "findOne");
    mockingoose(Role).toReturn(null, "findOne");

    await register(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Role not found",
    });
  });

  it("should register a new user successfully", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: {
        name: "New User",
        email: "newuser@example.com",
        password: "password123",
        roleName: "User",
      },
    });
    const res = httpMocks.createResponse();

    mockingoose(User).toReturn(null, "findOne");
    mockingoose(Role).toReturn({ _id: "roleId", name: "User" }, "findOne");
    mockingoose(User).toReturn({}, "save");
    jest.spyOn(bcrypt, "hash").mockResolvedValue("hashedPassword");

    await register(req, res);

    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual({
      message: "User registered successfully",
    });
  });

  it("should return 500 if an error occurs", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: {
        name: "New User",
        email: "newuser@example.com",
        password: "password123",
        roleName: "User",
      },
    });
    const res = httpMocks.createResponse();

    mockingoose(User).toReturn(null, "findOne");
    mockingoose(Role).toReturn({ _id: "roleId", name: "User" }, "findOne");
    jest.spyOn(bcrypt, "hash").mockRejectedValue(new Error("Hashing error"));

    await register(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toHaveProperty("message", "Error registering user");
    expect(res._getJSONData()).toHaveProperty("error");
  });
});

