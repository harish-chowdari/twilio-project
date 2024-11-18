const express = require("express");
const { sendOTPEmail, updatePassword } = require("../Controllers/Otp");
const sendSMS = require("../Controllers/Sms");
const router = express.Router();


router.post("/send-otp", sendOTPEmail);

router.post("/update-password", updatePassword);

router.post("/sms", sendSMS)


 
module.exports = router;
