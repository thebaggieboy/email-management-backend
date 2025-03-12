const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const { swaggerUi, specs } = require("./swagger");
const morgan = require("morgan");
const winston = require("winston");
const expressWinston = require("express-winston");


dotenv.config();

// Connect to db instance
connectDB();

const app = express();
app.use(express.json());
// Accepted domain origins
app.use(cors({

    origin: ['http://localhost:3000', 'https://email-management-backend.onrender.com'],
    credentials: true, // If you need to send cookies or authentication headers(which i do)
  }));
  

// Add this after your app initialization but before routes
app.use(morgan("dev")); // Options: combined, common, dev, short, tiny
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Request logging
app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'requests.log' })
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}}",
}));
// Routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/api", require("./routes"));

// Access PORT for local server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));