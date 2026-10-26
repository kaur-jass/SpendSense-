const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const expenseRoutes = require("./routes/expenseRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const predictionRoutes = require("./routes/predictionRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/expenses", expenseRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/predictions", predictionRoutes);
// Connect to MongoDB
connectDB();

// Health-check route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SpendSense API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`SpendSense server running on port ${PORT}`);
});