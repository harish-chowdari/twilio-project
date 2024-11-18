const twilio = require('twilio');

const accountSid = process.env.SID;
const authToken = process.env.AUTH_TOKEN;

const client = new twilio(accountSid, authToken);

const sendSMS = async (req, res) => {
    try {
        const response = await client.messages.create({
            body: req.body.message,
            from: process.env.FROM_NO, 
            to: req.body.toNumber 
        });
        console.log('Message sent:', response.sid);
        return res.json({ msg: "OTP sent successfully" })
    } catch (error) {
        console.error('Error sending message:', error.message)
    }
}


module.exports = sendSMS;
