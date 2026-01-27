const express = require("express");
const router = express.Router();
const billController = require("../controllers/billController");
const auth = require("../middleware/authmiddleware");
// Example: /api/bill/monthly/2026/1
router.get("/monthly/:year/:month", auth, billController.getMonthlyBill);
router.get("/history", auth, billController.getBillHistory);
router.post("/download", auth, billController.downloadBillPDF);

module.exports = router;
