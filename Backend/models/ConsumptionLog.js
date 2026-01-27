const mongoose = require("mongoose");

const ConsumptionLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Device",
    required: true
  },
  consumption: {
    type: Number, // kWh for the reading interval
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Consumptionlog", ConsumptionLogSchema);
