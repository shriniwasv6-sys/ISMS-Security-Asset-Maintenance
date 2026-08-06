const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "ISMS REST API",
            version: "1.0.0",
            description:
                "Integrated Security Asset Maintenance System API Documentation"
        },
        servers: [
            {
                url: "http://localhost:3000"
            }
        ]
    },

    apis: [
        "./routes/*.js"
    ]
};

module.exports = swaggerJsdoc(options);