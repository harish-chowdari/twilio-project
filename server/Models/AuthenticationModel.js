const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String
    },
    phone: {
        type: String
    },
    email: {
        type: String,
    },
    password: {
        type: String
    },
    otp: {
        type: String 
    },
    sms: {
        type: String
    }
}, {timestamps: true});

module.exports = mongoose.model("User", UserSchema);
