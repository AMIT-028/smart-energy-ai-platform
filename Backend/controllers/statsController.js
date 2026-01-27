const ConsumptionLog = require("../models/ConsumptionLog");
const mongoose = require("mongoose");

const ELECTRICITY_RATE = 8; // ₹ per kWh

exports.getOverviewStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    /* 🔹 1. CURRENT LOAD (convert Wh → kWh) */
    const recentLogs = await ConsumptionLog.aggregate([
      { $match: { user: userId, timestamp: { $gte: new Date(Date.now() - 2 * 60 * 1000) } } },
      { $group: { _id: null, totalWh: { $sum: "$consumption" } } }
    ]);
    const currentLoadWh = recentLogs[0]?.totalWh || 0;
    const currentLoadKWh = currentLoadWh / 1000;

    /* 🔹 2. DAILY COST */
    const todayLogs = await ConsumptionLog.aggregate([
      {
        $match: {
          user: userId,
          timestamp: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        }
      },
      { $group: { _id: null, totalWh: { $sum: "$consumption" } } }
    ]);
    const dailyUsageWh = todayLogs[0]?.totalWh || 0;
    const dailyUsageKWh = dailyUsageWh / 1000;
    const dailyCost = dailyUsageKWh * ELECTRICITY_RATE;

    /* 🔹 3. ACTIVE DEVICES (sent logs in last 3 min) */
    const activeDevices = await ConsumptionLog.distinct("device", {
      user: userId,
      timestamp: { $gte: new Date(Date.now() - 3 * 60 * 1000) }
    });
    const activeDeviceCount = activeDevices.length;

    /* 🔹 4. EFFICIENCY */
    // Ideal = 3 kWh per day (example baseline)
    const idealDailyKWh = 3;
    const efficiency = dailyUsageKWh > 0
      ? Math.min(100, (idealDailyKWh / dailyUsageKWh) * 100)
      : 100;

    res.json({
      currentLoad: currentLoadKWh.toFixed(3),   // kWh for last 2 minutes
      dailyCost: dailyCost.toFixed(2),         // INR
      activeDevices: activeDeviceCount,
      efficiency: efficiency.toFixed(1) + "%"
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error in stats" });
  }
};
