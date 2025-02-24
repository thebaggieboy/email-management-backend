const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Email Response Generator API",
        version: "1.0.0",
        description: "API documentation for the Email Response Generator SaaS",
      },
      servers: [
        {
          url: "http://localhost:5000", // Update with your server URL
          description: "Local server",
        },
      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
        schemas: {
          Email: {
            type: "object",
            properties: {
              _id: {
                type: "string",
                description: "The email ID",
              },
              userId: {
                type: "string",
                description: "The user ID",
              },
              gmailId: {
                type: "string",
                description: "The Gmail ID",
              },
              subject: {
                type: "string",
                description: "The email subject",
              },
              from: {
                type: "string",
                description: "The sender's email address",
              },
              snippet: {
                type: "string",
                description: "A snippet of the email content",
              },
              body: {
                type: "string",
                description: "The full email content",
              },
              receivedAt: {
                type: "string",
                format: "date-time",
                description: "The timestamp when the email was received",
              },
            },
            example: {
              _id: "64f1b2c8e4b0a1a2b3c4d5e6",
              userId: "64f1b2c8e4b0a1a2b3c4d5e7",
              gmailId: "1832f3e4d5c6b7a8",
              subject: "Order Confirmation",
              from: "noreply@example.com",
              snippet: "Thank you for your order!",
              body: "Base64 encoded email body...",
              receivedAt: "2023-10-01T12:34:56.789Z",
            },
          },
        },
      },
    },
    apis: ["./routes/*.js"], // Path to your route files
  };
const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };