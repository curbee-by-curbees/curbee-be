import dotenv from 'dotenv';
import twilio from 'twilio';
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

const twilioClient = twilio(
  accountSid,
  authToken
);

// twilioClient.messages.create -> Promise<to send an SMS>
export const sendSms = (to, message, mediaUrl) => {
  return twilioClient.messages.create({
    body: message,
    from: process.env.TWILIO_NUMBER,
    mediaUrl: [mediaUrl],
    to
  });
};
