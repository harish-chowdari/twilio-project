const express = require("express");
const { sendOTPEmail, updatePassword, sendOtpPhone, updatePasswordPhone } = require("../Controllers/Otp");
const sendSMS = require("../Controllers/Sms");
const router = express.Router();


router.post("/send-otp", sendOTPEmail);

router.post("/update-password", updatePassword);

router.post("/sms", sendOtpPhone);

router.post("/update-password-phone", updatePasswordPhone);

 
module.exports = router;
