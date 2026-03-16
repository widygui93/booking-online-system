const bcrypt = require("bcrypt");
const twilio = require("twilio");
require("dotenv").config();

const generateOTP = () => {
  return String(Math.random()).slice(-6);
};

const hashingOTP = async (OTP) => {
  console.log("otp plain text before hashing:" + OTP);
  return await bcrypt.hash(OTP, (saltRounds = 10));
};

const sendOTP = (requestData, OTP) => {
  const { booking_date, start_time, massage_type, phone_number } = requestData;
  const accountSid = process.env.ACCOUNT_SID;
  const authToken = process.env.AUTH_TOKEN;
  const client = twilio(accountSid, authToken);

  client.messages
    .create({
      body: `Halo, anda telah memilih layanan ${massage_type} di booking di tanggal ${booking_date} yang dimulai di jam ${start_time}. Berikut adalah OTP anda ${OTP}`,
      from: `whatsapp:${process.env.FROM_NUMBER}`,
      to: `whatsapp:+62${phone_number.slice(1)}`,
    })
    .then((message) => console.log(message.sid));
};

module.exports = {
  generateOTP,
  hashingOTP,
  sendOTP,
};
