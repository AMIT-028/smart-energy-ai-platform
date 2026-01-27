// routes/mlRoutes.js
const express = require("express");
const router = express.Router();
const mlController = require("../controllers/mlController");

// 🔮 Prediction route
router.get("/predict/:deviceId", mlController.getPredictions);

// 📅 Forecast route
router.post("/forecast/:deviceId", mlController.get7DayForecast);

module.exports = router;
