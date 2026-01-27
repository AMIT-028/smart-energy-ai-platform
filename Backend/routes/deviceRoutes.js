const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authmiddleware");
const {
  addDevice,
  getDevices,
  deleteDevice,
  updateDeviceStatus,
} = require("../controllers/devicecontroller");

// Add new device
router.post("/add", authMiddleware, addDevice);

// Get all devices of a user
router.get("/my-devices", authMiddleware, getDevices);

//delte device
router.delete("/delete/:id", authMiddleware, deleteDevice);

//update device
router.put("/update-status/:id", authMiddleware, updateDeviceStatus);

module.exports = router;
