const httpMocks = require("node-mocks-http");
const mockingoose = require("mockingoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { login } = require('../../userController');
const User = require('../../../models/User');

describe("login", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should login an existing user successfully", async () => {
        const req = httpMocks.createRequest({
            method: "POST",
            body: {
                email: "existinguser@example.com",
                password: "password123",
            },
        });
        const res = httpMocks.createResponse();

        const mockUser = {
            _id: "userId",
            name: "Existing User",
            email: "existinguser@example.com",
            password: "hashedPassword",
            isAdmin: false,
        };

        mockingoose(User).toReturn(mockUser, "findOne");
        jest.spyOn(bcrypt, "compare").mockResolvedValue(true);
        jest.spyOn(jwt, "sign").mockReturnValue("mockToken");

        await login(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({
            message: "Login successful",
            token: "mockToken",
        });
    });

    it("should return 401 if user is not found", async () => {
        const req = httpMocks.createRequest({
            method: "POST",
            body: {
                email: "nonexistentuser@example.com",
                password: "password123",
            },
        });
        const res = httpMocks.createResponse();

        mockingoose(User).toReturn(null, "findOne");

        await login(req, res);

        expect(res.statusCode).toBe(401);
        expect(res._getJSONData()).toEqual({
            message: "Invalid credentials",
        });
    });

    it("should return 401 if password does not match", async () => {
        const req = httpMocks.createRequest({
            method: "POST",
            body: {
                email: "existinguser@example.com",
                password: "wrongpassword",
            },
        });
        const res = httpMocks.createResponse();

        const mockUser = {
            _id: "userId",
            name: "Existing User",
            email: "existinguser@example.com",
            password: "hashedPassword",
            isAdmin: false,
        };

        mockingoose(User).toReturn(mockUser, "findOne");
        jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

        await login(req, res);

        expect(res.statusCode).toBe(401);
        expect(res._getJSONData()).toEqual({
            message: "Invalid credentials",
        });
    });

    it("should return 500 if an error occurs", async () => {
        const req = httpMocks.createRequest({
            method: "POST",
            body: {
                email: "existinguser@example.com",
                password: "password123",
            },
        });
        const res = httpMocks.createResponse();

        mockingoose(User).toReturn(new Error('Database error'), "findOne");

        await login(req, res);

        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({
            message: "Error logging in",
            error: expect.anything(),
        });
    });
});
