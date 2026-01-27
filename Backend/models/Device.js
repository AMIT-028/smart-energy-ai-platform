const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeviceSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  power: {
    type: Number,
    required: true, // watts
  },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["on", "off"],
    default: "off",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true, // device belongs to a user
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Device", DeviceSchema);
