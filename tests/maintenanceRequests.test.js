const request = require("supertest");
const app = require("../app");

const { closePool } = require("../config/db");

describe("Maintenance Requests API", () => {
    test("GET /api/maintenance-requests should return a response", async () => {
        const response = await request(app)
            .get("/api/maintenance-requests");

        expect([200, 401]).toContain(response.statusCode);
    });

    test("POST /api/maintenance-requests should reject invalid data", async () => {
        const response = await request(app)
            .post("/api/maintenance-requests")
            .send({});

        expect([400, 401]).toContain(response.statusCode);
    });
});

afterAll(async () => {
    await closePool();
});