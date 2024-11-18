const twilio = require('twilio');

// Replace with your Twilio credentials
const accountSid = 'your_account_sid';
const authToken = 'your_auth_token';
const client = new twilio(accountSid, authToken);

const sendSMS = async (to, message) => {
    try {
        const response = await client.messages.create({
            body: message,
            from: '+1234567890', // Your Twilio phone number
            to: to // Recipient's phone number
        });
        console.log('Message sent:', response.sid);
    } catch (error) {
        console.error('Error sending message:', error.message);
    }
};

// Example usage
sendSMS('+9876543210', 'Hello from Twilio!');
