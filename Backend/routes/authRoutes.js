const express = require('express');
const router = express.Router();
const { SignupUser, LoginUser } = require('../controllers/authcontroller');
const authMiddleware=require("../middleware/authmiddleware")
router.post("/signup",(SignupUser));
router.post("/login",(LoginUser));
// PROTECTED ROUTE
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user
  });
});
module.exports=router;