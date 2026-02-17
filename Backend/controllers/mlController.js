// controllers/mlController.js
const axios = require("axios");
const ConsumptionLog = require("../models/ConsumptionLog");
const mongoose = require("mongoose");

// 🔥 Peak alert imports
const { sendPeakAlert } = require("../utils/mailer");
const Device = require("../models/Device");

// Cooldown map (in-memory)
const lastAlertMap = new Map();

// GET /api/ml/predict/:deviceId
exports.getPredictions = async (req, res) => {
  try {
    const { deviceId } = req.params;

    // 1. Fetch last 5 logs
    const logs = await ConsumptionLog.find({
      device: new mongoose.Types.ObjectId(deviceId)
    })
      .sort({ timestamp: -1 })
      .limit(5);

    if (logs.length === 0) {
      return res.status(200).json({
        input: [],
        prediction: null,
        message: "No logs found for this device."
      });
    }

    const past = logs.reverse().map(log => log.consumption);

    // 2. Call Flask ML service
    const mlResponse = await axios.post("https://smart-energy-ai-platform.onrender.com/predict", {
      device_id: deviceId,
      timestamp: new Date().toISOString()
    });

    const prediction = mlResponse.data.prediction;

    // 3. Peak detection logic
    const avg = past.reduce((a, b) => a + b, 0) / past.length;
    const isPeak = prediction !== null && prediction > avg * 1.2;

    // 4. Peak alert with cooldown
    if (isPeak) {
      const now = Date.now();
      const last = lastAlertMap.get(deviceId) || 0;

      // 30 मिनट cooldown
      if (now - last > 30 * 60 * 1000) {
        try {
          // Fetch device + user email
          const device = await Device.findById(deviceId).populate("user");

          if (device && device.user && device.user.email) {
            await sendPeakAlert({
              to: device.user.email,
              deviceName: device.name,
              prediction,
              avg
            });

            console.log("📧 Peak alert email sent to:", device.user.email);
            lastAlertMap.set(deviceId, now);
          }
        } catch (mailError) {
          console.error("Email alert failed:", mailError.message);
        }
      } else {
        console.log("⏳ Peak alert skipped due to cooldown");
      }
    }

    // 5. Send normal response to frontend
    return res.status(200).json({
      message: "Prediction generated",
      input: past,
      prediction,
      isPeak,
      mlMessage: mlResponse.data.message || null
    });

  } catch (error) {
    console.error("ML Controller Error:", error.message);
    res.status(500).json({ message: "ML Service Error" });
  }
};


// POST /api/ml/forecast/:deviceId
exports.get7DayForecast = async (req, res) => {
  try {
    const { deviceId } = req.params;

    const response = await axios.post(
      "http://localhost:5001/predict/today-forecast",
      { device_id: deviceId }
    );

    return res.status(200).json({
      forecast: response.data.forecast
    });

  } catch (error) {
    console.error("Forecast Error:", error.message);
    res.status(500).json({ message: "Forecast service failed" });
  }
};
