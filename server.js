const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const { swaggerUi, specs } = require("./swagger");


dotenv.config();

// Connect to db instance
connectDB();

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true, // If you need to send cookies or authentication headers
  }));
  

// Routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/api", require("./routes"));

// Access PORT for local server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));