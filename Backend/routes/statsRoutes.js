const express = require("express");
const router = express.Router();

const  authmiddleware  = require("../middleware/authmiddleware");
const { getOverviewStats } = require("../controllers/statsController");

router.get("/overview", authmiddleware, getOverviewStats);

module.exports = router;
