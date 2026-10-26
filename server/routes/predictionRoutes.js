const express = require("express");
const router = express.Router();

const {
getMonthlyPrediction,
} = require("../controller/predictionController");

router.get("/:month", getMonthlyPrediction);

module.exports = router;
