module.exports = (app) => {
  const bookings = require("../controllers/booking.controller");
  const {
    bookingValidator,
    otpValidator,
    resendOTPValidator,
    checkValidation,
    paymentValidator,
  } = require("../middlewares/validator");
  const router = require("express").Router();

  router.get("/home", bookings.welcomeBooking);

  router.post(
    "/hold",
    bookingValidator,
    checkValidation,
    bookings.createTemporaryBooking,
  );

  router.post(
    "/resendOTP",
    resendOTPValidator,
    checkValidation,
    bookings.resendOTP,
  );

  router.post("/verify", otpValidator, checkValidation, bookings.verifyOTP);

  router.post("/payment", paymentValidator, checkValidation, bookings.payment);

  router.post("/webhook/payment-notification", bookings.paymentNotification);

  router.get("/redirect/finish-payment", bookings.redirectFinishPayment);

  app.use("/booking", router);
  app.use((req, res) =>
    res.status(404).json({ status: "failed", message: "resource not found" }),
  );
};
