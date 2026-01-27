const ConsumptionLog=require("../models/ConsumptionLog.js");
const Device=require("../models/Device.js")
const mongoose=require("mongoose")
// ADD SINGLE CONSUMPTION LOG
exports.addLog = async (req, res) => {
  try {
    const { deviceId, consumption } = req.body;

    if (!deviceId || !consumption) {
      return res
        .status(400)
        .json({ message: "deviceId and consumption are required" });
    }

    // (optional but good): ensure device belongs to this user
    const device = await Device.findOne({ _id: deviceId, user: req.user.id });
    if (!device) {
      return res
        .status(404)
        .json({ message: "Device not found or not owned by user" });
    }

    const log = new ConsumptionLog({
      user: req.user.id,
      device: deviceId,
      consumption,
      timestamp: new Date(),
    });

    await log.save();
    req.io.emit("newLog", {
  timestamp: log.timestamp,
  consumption: log.consumption
});

    res.status(201).json({
      message: "Consumption log added successfully",
      log,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
// GET LOGS FOR A DEVICE (for charts)
exports.getLogs = async (req, res) => {
  try {
    const { deviceId } = req.params;

    const logs = await ConsumptionLog.find({
      user: req.user.id,
      device: deviceId,
    }).sort({ timestamp: 1 }); // oldest → newest

    res.status(200).json({ logs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getDailyUsage = async (req, res) => {
  try {
    const { deviceId } = req.params;

    const result = await ConsumptionLog.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id), device: new mongoose.Types.ObjectId(deviceId) } },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$timestamp" },
            month: { $month: "$timestamp" },
            year: { $year: "$timestamp" }
          },
          totalConsumption: { $sum: "$consumption" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ]);

    res.status(200).json({ dailyUsage: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getTodayHourWiseUsage = async (req, res) => {
  try {
    const result = await ConsumptionLog.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
          timestamp: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      },
      {
        $group: {
  _id: {
    $hour: {
      date: "$timestamp",
      timezone: "Asia/Kolkata"
    }
  },
  totalConsumption: { $sum: "$consumption" }
}   
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Week - Day wise usage
exports.getWeeklyDayWiseUsage = async (req, res) => {
  try {
    const result = await ConsumptionLog.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
          timestamp: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: "$timestamp" },
          totalConsumption: { $sum: "$consumption" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
