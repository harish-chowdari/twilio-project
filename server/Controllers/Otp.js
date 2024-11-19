const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
const UserDetails = require("../Models/AuthenticationModel");
const twilio = require('twilio');


dotenv.config();

const accountSid = process.env.SID;
const authToken = process.env.AUTH_TOKEN;
const client = new twilio(accountSid, authToken);


const sendOTPEmail = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ emailRequire: "Email required" });
    }

    try {
        const user = await UserDetails.findOne({ email: email });
        if (!user) {
            return res.json({ userNotExist: "User does not exist" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otp.toString(), salt);

        user.otp = hashedOtp;
        user.otpExpiresAt = otpExpiresAt;
        await user.save();

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailContent = `
        <h1>OTP Verification</h1>
        <p>Your One-Time Password (OTP) for verification is: <strong>${otp}</strong></p>
        <p>Please use this OTP to complete your verification. It is valid for 5 minutes.</p>
        `;

        const message = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP for Verification",
            html: mailContent
        };

        transporter.sendMail(message).then(() => {
            return res.status(201).json({ msg: "OTP sent successfully" });
        }).catch(error => {
            return res.status(500).json({ error });
        });

    } catch (error) {
        return res.status(500).json({ error: "An error occurred while processing the request" });
    }
};

const updatePassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(200).json({ allFieldsRequired: "Email, OTP, and new password are required" });
    }

    try {
        const user = await UserDetails.findOne({ email: email });

        if (!user) {
            return res.status(200).json({ userNotExist: "User not found" });
        }

        const isOtpValid = await bcrypt.compare(otp.toString(), user.otp);

        if (!isOtpValid) {
            return res.status(200).json({ otpNotValid: "Invalid OTP" });
        }

        const now = new Date();
        if (user.otpExpiresAt < now) {
            return res.status(200).json({ otpExpired: "OTP has expired" });
        }

        user.password = newPassword;
        user.otp = undefined;
        user.otpExpiresAt = undefined;

        await user.save();

        return res.status(200).json({ updatedPassword: "Password updated successfully" });
    } catch (error) {
        return res.status(500).json({ error: "An error occurred while updating the password" });
    }
};

const sendOtpPhone = async (req, res) => {

    const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

        const { phone } = req.body;

        if (!phone) {
            return res.json({ phoneRequire: "Phone number required" });
        }

        const isUserExist = await UserDetails.findOne({ phone: phone });
        if (!isUserExist) {
            return res.json({ userNotExist: "User does not exist" });
        }

        isUserExist.sms = otp;
        await isUserExist.save();

    try {
        const response = await client.messages.create({
            body: otp,
            from: process.env.FROM_NO,
            to: phone
        });
        console.log('Message sent:', response.sid);
        return res.json({ msg: "OTP sent successfully" })
    } catch (error) {
        console.error('Error sending message:', error.message)
    }
}

const updatePasswordPhone = async (req, res) => {
    const { phone, otp, newPassword } = req.body;

    if (!phone || !otp || !newPassword) {
        return res.status(200).json({ allFieldsRequired: "Phone number, OTP, and new password are required" });
    }

    try {
        const user = await UserDetails.findOne({ phone: phone });

        if (!user) {
            return res.status(200).json({ userNotExist: "User not found" });
        }

// no need to compare bycrypt
        if (user.sms !== otp) {
            return res.status(200).json({ otpNotValid: "Invalid OTP" });
        }

        // no need to compare expiry
        user.password = newPassword;
        user.sms = undefined;

        await user.save();

        return res.status(200).json({ updatedPassword: "Password updated successfully" });
    } catch (error) {
        return res.status(500).json({ error: "An error occurred while updating the password" });
    }

}

module.exports = {
    sendOTPEmail,
    updatePassword,
    sendOtpPhone,
    updatePasswordPhone

};
