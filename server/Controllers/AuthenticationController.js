const Schema = require("../Models/AuthenticationModel.js");

async function SigUp(req, res) {
  try {
    const { name, phone, email, password } = req.body;

    const isUserExist = await Schema.findOne({ email: email });

    const isPhoneExist = await Schema.findOne({ phone: phone });

    if (isPhoneExist) {
      return res.status(200).json({ PhoneExist: "Phone number already exists" });
    }

    if (isUserExist) { 
      return res.status(200).json({ AlreadyExist: "Account already exists" });
    }

    if (!name || !email || !phone || !password) {
      return res.status(200).json({ EnterAllDetails: "Please fill all the fields" });
    }

    const data = new Schema({
      name,
      phone,
      email,
      password,
      otp: "",
      otpExpiresAt: "",
    });

    const d = await data.save();
    return res.json(d);
  } catch (error) {
    console.log(error);
  }
}

async function Login(req, res) {
  try {
    const { email, phone, password } = req.body;

    if (!email || !password || phone) {  
      return res.status(200).json({ EnterAllDetails: "Please fill all the fields" });
    }

    const isUserExist = await Schema.findOne({ email: email });
    if (!isUserExist) {
      return res.status(200).json({ NotExist: "User does not exist" });
    }

    if (password !== isUserExist.password) {
      return res.status(200).json({ Incorrect: "Incorrect password" });
    }

    return res.json(isUserExist);
  } catch (error) { 
    console.log(error);
  }
}

module.exports = {
  SigUp,
  Login
};
