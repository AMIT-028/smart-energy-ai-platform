require("dotenv").config();
const Device = require("../models/Device");
const ConsumptionLog = require("../models/ConsumptionLog");

// Access global io + existing DB connection
const io = global.io;

// length of one simulation step
const INTERVAL_SECONDS = 2;
const INTERVAL_HOURS = INTERVAL_SECONDS / 3600; // 2 / 3600 h

async function simulateEnergy() {
  try {
    const devices = await Device.find({});
    if (!devices.length) return;

    for (const device of devices) {
      if (device.status !== "on") continue;

      // ---- PHYSICAL FORMULA (Wh per 2 seconds) ----
      // Energy(Wh) = Power(W) * Time(h)
      const baseWh = device.power * INTERVAL_HOURS;

      // Add small +/- 10% randomness
      const randomFactor = 0.9 + Math.random() * 0.2; // 0.9–1.1
      const energyWh = baseWh * randomFactor;

      // store with 6 decimal places so tiny values aren't rounded to 0
      const consumption = Number(energyWh.toFixed(6));

      const log = await ConsumptionLog.create({
        user: device.user,
        device: device._id,
        consumption,   // UNIT: Wh per 2-second step
        timestamp: new Date(),
      });

      console.log("✔ Saved to DB:", log._id.toString(), device.name, consumption);
      if (io) io.emit("newLog", log);
    }
  } catch (error) {
    console.error("Simulation Error:", error.message);
  }
}

setInterval(simulateEnergy, INTERVAL_SECONDS * 1000);
