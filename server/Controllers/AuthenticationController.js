const nodemailer = require('nodemailer');
const twilio = require('twilio');
const Users = require("../Models/AuthenticationModel");
const accountSid = process.env.SID;
const authToken = process.env.AUTH_TOKEN;
const client = new twilio(accountSid, authToken);


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Send Email
const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    };
    await transporter.sendMail(mailOptions);
};

// Send SMS
const sendSMS = async (to, message) => {
    await client.messages.create({
        body: message,
        from: process.env.FROM_NO,
        to,
    });
};

// Signup Function
const SigUp = async (req, res) => {
    try {
        const { name, phone, email, password, preferredLogin } = req.body;

        if (!name || !password || (!phone && !email)) {
            return res.status(200).json({ EnterAllDetails: "Please fill all the fields" });
        }

        let isUserExist = null;
        if (email) {
            isUserExist = await Users.findOne({ email });
            if (isUserExist) {
                return res.status(200).json({ AlreadyExist: "Account already exists with this email" });
            }
        }
        if (phone) {
            isUserExist = await Users.findOne({ phone });
            if (isUserExist) {
                return res.status(200).json({ PhoneExist: "Account already exists with this phone number" });
            }
        }

        const data = new Users({
            name,
            phone,
            email,
            password,
        });

        const savedUser = await data.save();

        if (preferredLogin === "email" && email) {
            await sendEmail(email, "Signup Successful", "Welcome! Your account has been created.");
        } else if (preferredLogin === "phone" && phone) {
          await sendSMS(phone, "Welcome! Your account has been created.");
        }

        return res.json(savedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Login Function
const Login = async (req, res) => {
    try {
        const { email, phone, password, preferredLogin } = req.body;

        if (!password || (!email && !phone)) {
            return res.status(200).json({ EnterAllDetails: "Please fill all the fields" });
        }

        let isUserExist = null;
        if (email) {
            isUserExist = await Users.findOne({ email });
        } else if (phone) {
            isUserExist = await Users.findOne({ phone });
        }

        if (!isUserExist) {
            return res.status(200).json({ NotExist: "User does not exist" });
        }

        if (password !== isUserExist.password) {
            return res.status(200).json({ Incorrect: "Incorrect password" });
        }

        if (preferredLogin === "email" && email) {
            await sendEmail(email, "Login Successful", "You have successfully logged in.");
        } else if (preferredLogin === "phone" && phone) {
            await sendSMS(phone, "You have successfully logged in.");
        }

        return res.json(isUserExist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    SigUp,
    Login,
};
