// const { validationResult } = require("express-validator");
const crypto = require("crypto");
const {
  holdBooking,
  savehashOTP,
  otpVerification,
  otpResend,
  paymentWebhook,
  checkDataPayment,
} = require("../databases/database_BOS");
const { generateOTP, hashingOTP, sendOTP } = require("../utils/otp");
require("dotenv").config();

exports.welcomeBooking = (req, res) => {
  res.status(200).json({ text: "welcome booking home page" });
};

exports.createTemporaryBooking = async (req, res) => {
  try {
    const result = await holdBooking(req.body);

    if (result.status === "failed") {
      res.status(500).json(result);
    } else {
      const OTP = generateOTP();
      const hashOTP = await hashingOTP(OTP);
      await savehashOTP(result.bookingResult.id, hashOTP);
      sendOTP(req.body, OTP);
      res.status(200).json(result.bookingResult);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ result: "failed create temporary booking" });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const result = await otpVerification(req.body);

    if (result.status === "failed") {
      res.status(500).json(result);
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res
      .status(500)
      .json({ status: "failed", message: "failed otp verification" });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const result = await otpResend(req.body);
    if (result.status === "failed") {
      res.status(500).json(result);
    } else if (result.status === "failed-max-attempts") {
      console.log(result.message);
      res.redirect("/booking/home");
    } else {
      const OTP = generateOTP();
      const hashOTP = await hashingOTP(OTP);
      await savehashOTP(req.body.booking_id, hashOTP);
      sendOTP(
        {
          booking_date: result.data.booking_date,
          start_time: result.data.Timeslot.start_time,
          massage_type: result.data.Service.massage_type,
          phone_number: result.data.Customer.phone_number,
        },
        OTP,
      );
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ status: "failed", message: "failed resend otp" });
  }
};

exports.payment = async (req, res) => {
  try {
    const result = await checkDataPayment(req.body);

    if (result.status === "failed") {
      return res.status(500).json({ message: result });
    }

    const SERVER_KEYbase64Encoded = Buffer.from(
      `${process.env.MIDTRANS_SERVER_KEY}:`,
    ).toString("base64");

    const endpoints = {
      checkStatus: `https://api.sandbox.midtrans.com/v2/${req.body.booking_id}/status`,
      transaction: "https://app.sandbox.midtrans.com/snap/v1/transactions",
    };

    const options = {
      checkStatus: {
        method: "GET",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic ${SERVER_KEYbase64Encoded}`,
        },
      },
      transaction: {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic ${SERVER_KEYbase64Encoded}`,
          "Idempotency-Key": req.body.booking_id,
        },
        body: JSON.stringify({
          transaction_details: {
            order_id: req.body.booking_id,
            gross_amount: req.body.price,
          },
          credit_card: {
            secure: true,
          },
          customer_details: {
            name: req.body.name,
            phone: req.body.phone_number,
          },
        }),
      },
    };

    const status = await (
      await fetch(endpoints.checkStatus, options.checkStatus)
    ).json();

    if (
      status.transaction_status === "settlement" ||
      status.transaction_status === "capture"
    ) {
      return res
        .status(200)
        .json({ status: "success", message: "Payment already settled" });
    }

    const transaction = await (
      await fetch(endpoints.transaction, options.transaction)
    ).json();

    return res.status(200).json({ status: "success", result: transaction });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "failed", message: "failed payment" });
  }
};

exports.paymentNotification = async (req, res) => {
  try {
    console.log(req.body);

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const hash = crypto
      .createHash("sha512")
      .update(
        `${req.body.order_id}${req.body.status_code}${req.body.gross_amount}${serverKey}`,
      )
      .digest("hex");

    if (hash !== req.body.signature_key) {
      res
        .status(403)
        .json({ status: "failed", message: "Invalid Signature Key" });
    }

    const result = await paymentWebhook(req.body);

    if (result.status == "success") {
      console.log(result.message);
      res
        .status(200)
        .json({ status: "success", message: "payment notification received" });
    } else if (result.status == "failure") {
      console.log(result.message);
      res.status(200).json({ status: "failed", message: result.message });
    } else if (result.status == "pending") {
      console.log(
        `status: ${result.status} , message: waiting for settlement complete`,
      );
      res.status(200).json({
        status: "pending",
        message: "waiting for settlement complete",
      });
    } else {
      console.error(`status: ${result.status} message: ${result.message}`);
      res.status(200).json({ status: result.status, message: result.message });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: "failed", message: "failed payment notification" });
  }
};

exports.redirectFinishPayment = async (req, res) => {
  res.set("Content-Type", "text/html");
  res
    .status(200)
    .send("<p>You will get notification for successfull payment</p>");
};
