const schedule = require("node-schedule");
const { setExpiredVerification } = require("../databases/database_BOS");

// hour 8 minutes 27 '27 8 * * *'
// Every 5 minutes 27 '*/5 * * * *'

const job = schedule.scheduleJob("*/1 * * * *", async function () {
  try {
    console.log(
      "start cleaning expired pending_verification for bookings table : " +
        new Date()
    );

    const resultExpiredVerification = await setExpiredVerification();
    console.log(resultExpiredVerification.message);

    console.log(
      "finish cleaning expired pending_verification for bookings table : " +
        new Date()
    );
  } catch (err) {
    console.log(err);
  }
});
