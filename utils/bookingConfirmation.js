const twilio = require("twilio");
require("dotenv").config();

const sendBookingConfirmation = (dataBookingConfirmation) => {
  const { booking_date, start_time, massage_type, phone_number, amounts } =
    dataBookingConfirmation;
  const accountSid = process.env.ACCOUNT_SID;
  const authToken = process.env.AUTH_TOKEN;
  const client = twilio(accountSid, authToken);

  client.messages
    .create({
      body: `Booking Success Confirmation, 

        Anda telah sukses melakukan booking dengan keterangan sebagai berikut:
        * Booking Date: *${booking_date}*
        * Start Time: *${start_time}*
        * Massage Type: *${massage_type}*
        * Amounts: *${amounts}*
        
        Terima kasih atas pemesanan Anda.`,
      from: `whatsapp:${process.env.FROM_NUMBER}`,
      to: `whatsapp:+62${phone_number.slice(1)}`,
    })
    .then((message) => console.log(message.sid));
};

module.exports = {
  sendBookingConfirmation,
};
