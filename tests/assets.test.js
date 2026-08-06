const request = require("supertest");
const app = require("../app");
const { closePool } = require("../config/db");

describe("Assets API", () => {
    test("GET /api/assets should return a response", async () => {
        const response = await request(app)
            .get("/api/assets");

        expect([200, 401]).toContain(
            response.statusCode
        );
    });

    test(
        "GET /api/assets/999999 should return not found or unauthorized",
        async () => {
            const response = await request(app)
                .get("/api/assets/999999");

            expect([404, 401]).toContain(
                response.statusCode
            );
        }
    );
});

afterAll(async () => {
    await closePool();
});