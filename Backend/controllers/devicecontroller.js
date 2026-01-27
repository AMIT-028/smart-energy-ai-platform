const Device = require("../models/Device");
const ConsumptionLog = require("../models/ConsumptionLog");

// ➤ Add Device
exports.addDevice = async (req, res) => {
  try {
    const { name, power, location, status } = req.body;

    if (!name || !power || !location) {
      return res.status(400).json({ message: "Name, power and location are required" });
    }

    const device = new Device({
      name,
      power :Number(power), 
      location,
      status: status || "off",
      user: req.user.id
    });

    await device.save();

    res.status(201).json({
      message: "Device added successfully",
      device
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ➤ Get User Devices
exports.getDevices = async (req, res) => {
  try {
    const devices = await Device.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ devices });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ➤ Delete Device + Related Logs (important)
exports.deleteDevice = async (req, res) => {
  try {
    const device = await Device.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!device) {
      return res.status(404).json({ message: "Device not found or unauthorized" });
    }

    // Delete all energy logs for that device
    await ConsumptionLog.deleteMany({ device: req.params.id });

    res.status(200).json({ message: "Device deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ➤ Update Device Status (turn ON / OFF)
exports.updateDeviceStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["on", "off"].includes(status)) {
      return res.status(400).json({ message: "Status must be 'on' or 'off'" });
    }

    const device = await Device.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { status },
      { new: true }
    );

    if (!device) {
      return res.status(404).json({ message: "Device not found or unauthorized" });
    }

    res.status(200).json({
      message: "Status updated successfully",
      device
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
  