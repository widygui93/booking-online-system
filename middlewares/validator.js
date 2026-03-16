const { body, validationResult } = require("express-validator");

exports.bookingValidator = [
  body("booking_created_at")
    .trim()
    .escape()
    .isISO8601()
    .withMessage("Invalid booking created at format (YYYY-MM-DD HH:MM:SS)")
    .toDate(),

  body("booking_date")
    .trim()
    .escape()
    .isDate()
    .withMessage("Invalid booking date format (YYYY-MM-DD)"),

  body("start_time")
    .trim()
    .escape()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Invalid start time format (HH:mm)"),

  body("end_time")
    .trim()
    .escape()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Invalid end time format (HH:mm)"),

  body("timeslots_id")
    .trim()
    .escape()
    .isUUID()
    .toLowerCase()
    .withMessage("Invalid timeslot ID"),

  body("massage_id")
    .trim()
    .escape()
    .isUUID()
    .toLowerCase()
    .withMessage("Invalid massage ID"),

  body("massage_type")
    .trim()
    .escape()
    .isLength({ min: 3, max: 50 })
    .withMessage("Massage type is invalid"),

  body("name")
    .trim()
    .escape()
    .toLowerCase()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name is invalid"),

  body("phone_number")
    .trim()
    .escape()
    .isMobilePhone(["id-ID"])
    .matches(/^[0-9]{8,15}$/)
    .withMessage("Invalid phone number"),

  body("price").isInt({ min: 1 }).withMessage("Invalid price"),
];

exports.otpValidator = [
  body("booking_id")
    .trim()
    .escape()
    .isUUID()
    .toLowerCase()
    .withMessage("Invalid booking ID"),

  body("otp")
    .trim()
    .escape()
    .isLength({ min: 6, max: 6 })
    .matches(/^[0-9]{6,6}$/)
    .withMessage("Invalid otp"),
];

exports.resendOTPValidator = [
  body("booking_id")
    .trim()
    .escape()
    .isUUID()
    .toLowerCase()
    .withMessage("Invalid booking ID"),
];

exports.paymentValidator = [
  body("booking_id")
    .trim()
    .escape()
    .isUUID()
    .toLowerCase()
    .withMessage("Invalid booking ID"),

  body("name")
    .trim()
    .escape()
    .toLowerCase()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name is invalid"),

  body("phone_number")
    .trim()
    .escape()
    .isMobilePhone(["id-ID"])
    .matches(/^[0-9]{8,15}$/)
    .withMessage("Invalid phone number"),

  body("price").isInt({ min: 1 }).withMessage("Invalid price"),
];

exports.checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      errors: errors.array(),
    });
  }
  next();
};
