const request = require("supertest");
const app = require("../app");

const { closePool } = require("../config/db");

describe("Authentication API", () => {
    test("POST /api/auth/login should reject missing credentials", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({});

        expect(response.statusCode).toBeGreaterThanOrEqual(400);
        expect(response.body).toHaveProperty("message");
    });
});

afterAll(async () => {
    await closePool();
});