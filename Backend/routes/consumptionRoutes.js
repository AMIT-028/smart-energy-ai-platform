const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authmiddleware");
const { addLog, getLogs, getDailyUsage,getTodayHourWiseUsage,getWeeklyDayWiseUsage} = require("../controllers/consumptionController");

router.post("/add", authMiddleware, addLog);
router.get("/device/:deviceId", authMiddleware, getLogs);
router.get("/daily/:deviceId", authMiddleware, getDailyUsage);
router.get("/today-hour-wise", authMiddleware, getTodayHourWiseUsage);
router.get("/weekly-day-wise", authMiddleware, getWeeklyDayWiseUsage);


module.exports = router;
