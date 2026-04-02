const bcrypt = require("bcrypt");
const { Op, Transaction } = require("sequelize");
const db = require("../models/index");
// const timeslot = require("../models/timeslot");
const Booking = db.booking;
const Timeslot = db.timeslot;
const Therapist = db.therapist;
const Customer = db.customer;
const Payment = db.payment;
const Room = db.room;
const Service = db.service;
const SystemConfig = db.system_config;
const OTP = db.otp;
require("dotenv").config();

const { conflicted } = require("./conflictingBooking");
// const { webhook } = require("twilio/lib/webhooks/webhooks");

const database_BOS = new db.Sequelize(
  `mysql://${process.env.BOS_DB_USER}:${process.env.BOS_DB_PASSWORD}@${process.env.BOS_DB_HOST}:${process.env.BOS_DB_PORT}/${process.env.BOS_DB}`,
);

const getExpiredTimestamp = function (currentTimestamp, expiredMinutes) {
  return currentTimestamp + expiredMinutes * 60000;
};

const holdBooking = async function (dataRequest) {
  const transaction = await database_BOS.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  });
  try {
    const customerPending = await Customer.findOne({
      attributes: ["customer_code"],
      where: {
        phone_number: dataRequest.phone_number,
      },
      transaction: transaction,
    });

    if (customerPending) {
      const pendingBooking = await Booking.findOne({
        attributes: ["id"],
        where: {
          [Op.and]: [{ customer_code: customerPending.customer_code }],
          [Op.or]: [
            { status: "pending_verification" },
            { status: "pending_payment" },
          ],
          expires_at: {
            [Op.gte]: new Date(),
          },
        },
        transaction: transaction,
      });

      if (pendingBooking) {
        throw new Error("Please complete the previous pending booking");
      }
    }

    const timeslot = await Timeslot.findOne({
      where: {
        id: dataRequest.timeslots_id,
      },
      lock: transaction.LOCK.UPDATE,
      transaction: transaction,
    });

    if (!timeslot) {
      throw new Error("Timeslot not found");
    }

    const sysConfig = await SystemConfig.findOne({ transaction });

    // Lock and check ALL bookings for this timeslot (including pending ones)
    // This prevents race conditions where two transactions both see the same available resources
    const existingBookings = await Booking.findAll({
      attributes: ["therapist_id", "room_id"],
      where: {
        timeslot_code: timeslot.timeslot_code,
        [Op.or]: [
          { status: "confirmed" },
          { status: "pending_verification" },
          { status: "pending_payment" },
        ],
        // Only consider bookings that haven't expired
        expires_at: {
          [Op.gte]: new Date(),
        },
      },
      lock: transaction.LOCK.UPDATE, // CRITICAL: Lock these rows to prevent concurrent access
      transaction: transaction,
    });

    if (
      existingBookings.length >=
      Math.min(sysConfig.total_rooms, sysConfig.total_rooms)
    ) {
      throw new Error("Booking attempts has reached maximum resources limit");
    }

    let takenTherapists = 0;
    let takenRooms = 0;

    if (existingBookings.length !== 0) {
      takenTherapists = existingBookings.map(
        (existingBooking) => existingBooking.therapist_id,
      );

      takenRooms = existingBookings.map(
        (existingBooking) => existingBooking.room_id,
      );
    }

    // Build query condition for available therapists
    const therapistWhereCondition =
      takenTherapists.length > 0 ? { id: { [Op.notIn]: takenTherapists } } : {};

    const availableTherapists = await Therapist.findAll({
      attributes: ["id"],
      where: therapistWhereCondition,
      lock: transaction.LOCK.UPDATE, // Lock therapists to prevent concurrent selection
      transaction: transaction,
    });

    // Build query condition for available rooms
    const roomWhereCondition =
      takenRooms.length > 0 ? { id: { [Op.notIn]: takenRooms } } : {};

    const availableRooms = await Room.findAll({
      attributes: ["id"],
      where: roomWhereCondition,
      lock: transaction.LOCK.UPDATE, // CRITICAL: Lock rooms to prevent concurrent selection
      transaction: transaction,
    });

    let selectedTherapistID = "";
    let selectedRoomID = "";

    if (availableTherapists.length > 0 && availableRooms.length > 0) {
      const selectedIndexTherapistID = Math.floor(
        Math.random() * availableTherapists.length,
      );
      selectedTherapistID =
        availableTherapists[selectedIndexTherapistID].dataValues.id;

      const selectedIndexRoomID = Math.floor(
        Math.random() * availableRooms.length,
      );
      selectedRoomID = availableRooms[selectedIndexRoomID].dataValues.id;
    } else {
      throw new Error("Therapist or Room not available");
    }

    // Final verification: Double-check that the selected room  and the selected therapist isn't taken
    // This is an extra safety measure in case of edge cases
    const conflictingBooking = await conflicted(
      Booking,
      timeslot.timeslot_code,
      selectedRoomID,
      selectedTherapistID,
      transaction,
    );

    if (conflictingBooking) {
      throw new Error(
        "Selected room or threrapist is no longer available for this timeslot",
      );
    }

    let customer;
    if (!customerPending) {
      customer = await Customer.create(
        {
          id: crypto.randomUUID(),
          name: dataRequest.name,
          phone_number: dataRequest.phone_number,
          is_guest: true,
          customer_code: crypto.randomUUID(),
        },
        {
          transaction: transaction,
        },
      );
    } else {
      customer = { customer_code: customerPending.customer_code };
    }

    const currentDateTime = new Date();
    const expiredTimestamp = await getExpiredTimestamp(
      currentDateTime.getTime(),
      sysConfig.expired_minutes_payment,
    );
    currentDateTime.setTime(expiredTimestamp);

    const expiresAt =
      currentDateTime.toLocaleDateString("en-CA") +
      " " +
      currentDateTime.toLocaleTimeString("en-CA", {
        hour12: false,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      });

    const payment = await Payment.create(
      {
        id: crypto.randomUUID(),
        status: "pending_payment",
        expires_at: expiresAt,
        amounts: dataRequest.price,
        customer_code: customer.customer_code,
        payment_code: crypto.randomUUID(),
      },
      {
        transaction: transaction,
      },
    );

    const service = await Service.findOne({
      where: {
        id: dataRequest.massage_id,
      },
      transaction: transaction,
    });

    const bookingData = {
      id: crypto.randomUUID(),
      booking_created_at: dataRequest.booking_created_at,
      booking_date: dataRequest.booking_date,
      customer_code: customer.customer_code,
      room_id: selectedRoomID,
      therapist_id: selectedTherapistID,
      timeslot_code: timeslot.timeslot_code,
      payment_code: payment.payment_code,
      massage_code: service.massage_code,
      status: "pending_verification",
      expires_at: expiresAt,
    };

    const bookingResult = await Booking.create(bookingData, {
      transaction: transaction,
    });

    await transaction.commit();

    return { status: "success", bookingResult: bookingResult };
  } catch (er) {
    console.error(er);
    await transaction.rollback();
    return { status: "failed", error: er.message };
  }
};

const savehashOTP = async function (booking_id, hashOTP) {
  const transaction = await database_BOS.transaction();
  try {
    const sysConfig = await SystemConfig.findOne({ transaction });
    const currentDateTime = new Date();
    const expiredTimestamp = await getExpiredTimestamp(
      currentDateTime.getTime(),
      sysConfig.expired_minutes_otp,
    );
    currentDateTime.setTime(expiredTimestamp);

    const expiredAt =
      currentDateTime.toLocaleDateString("en-CA") +
      " " +
      currentDateTime.toLocaleTimeString("en-CA", {
        hour12: false,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      });

    console.log(expiredAt);

    const OTPData = {
      id: crypto.randomUUID(),
      booking_id: booking_id,
      otp_hash: hashOTP,
      expired_at: expiredAt,
      attempts: 0,
      is_verified: false,
      is_replaced: false,
    };

    const otpResult = await OTP.create(OTPData, {
      transaction: transaction,
    });

    await transaction.commit();

    return { status: "success", otpResult: otpResult };
  } catch (error) {
    console.error(error);
    await transaction.rollback();
    return { status: "failed", error: error.message };
  }
};

const otpVerification = async function (dataRequest) {
  const transaction = await database_BOS.transaction();
  try {
    const otp = await OTP.findOne({
      where: {
        booking_id: dataRequest.booking_id,
        is_replaced: false,
      },
      order: [["createdAt", "DESC"]],
      transaction: transaction,
    });

    if (!otp) {
      throw new Error("failed verification: Booking not found");
    }

    const sysConfig = await SystemConfig.findOne({ transaction });

    if (otp.attempts > sysConfig.max_attempts_otp) {
      throw new Error(
        "failed verification: exceeded max attempts otp verfication",
      );
    }

    if (otp.expired_at < new Date()) {
      throw new Error("failed verification: otp has already expired");
    }

    if (otp.is_verified) {
      throw new Error("failed verification: otp has already verified");
    }

    const match = await bcrypt.compare(dataRequest.otp, otp.otp_hash);

    if (match) {
      try {
        await OTP.update(
          { attempts: `${otp.attempts + 1}`, is_verified: true },
          {
            where: {
              booking_id: dataRequest.booking_id,
            },
          },
          { transaction: transaction },
        );
        await Booking.update(
          { status: "pending_payment" },
          {
            where: {
              id: dataRequest.booking_id,
            },
          },
          { transaction: transaction },
        );
        await transaction.commit();
        return { status: "success", message: "OTP verification successfully" };
      } catch (error) {
        console.error(error);
        await transaction.rollback();
        return { status: "failed", message: error.message };
      }
    } else {
      try {
        await OTP.update(
          { attempts: `${otp.attempts + 1}` },
          {
            where: {
              booking_id: dataRequest.booking_id,
            },
          },
          { transaction: transaction },
        );
        await transaction.commit();
        return { status: "failed", message: "failed otp verification" };
      } catch (error) {
        console.error(error);
        await transaction.rollback();
        return { status: "failed", message: error.message };
      }
    }
  } catch (error) {
    console.error(error);
    await transaction.rollback();
    return { status: "failed", message: error.message };
  }
};

const setExpiredVerification = async function () {
  const transaction = await database_BOS.transaction();
  try {
    const expiredBookings = await Booking.findAll({
      attributes: ["id"],
      where: {
        status: "pending_verification",
        "$OTPS.expired_at$": { [Op.lte]: new Date() },
      },
      include: [
        {
          model: OTP,
          required: true,
          attributes: ["expired_at", "booking_id"],
        },
      ],
      transaction: transaction,
    });

    if (expiredBookings.length === 0) {
      await transaction.commit();
      return { status: "success", message: "No expired booking found" };
    }
    expiredBookings.forEach(async (expiredBooking) => {
      await Booking.update(
        { status: "expired_verification" },
        {
          where: {
            id: expiredBooking.id,
          },
        },
        { transaction: transaction },
      );
    });
    await transaction.commit();
    return {
      status: "success",
      message: "Booking has been set to expired verification successfully",
    };
  } catch (error) {
    console.error(error);
    await transaction.rollback();
    return { status: "failed", message: error.message };
  }
};

const otpResend = async function (dataRequest) {
  const transaction = await database_BOS.transaction();
  try {
    const otps = await OTP.findAll({
      attributes: ["id", "createdAt"],
      where: {
        booking_id: dataRequest.booking_id,
      },
      order: [["createdAt", "DESC"]],
      transaction: transaction,
    });

    // resend otp is not for the first otp of booking
    if (otps.length === 0) {
      await transaction.commit();
      return { status: "success", message: "Otp is not eligible to be resent" };
    }
    // 1 booking is max 5 otps
    else if (otps.length >= 5) {
      await transaction.commit();
      return {
        status: "failed-max-attempts",
        message: "Already max Otp attempts of a booking",
      };
    }

    // 1 minute = 60000 milisecond
    if (new Date() - otps[0].createdAt <= 60000) {
      await transaction.commit();
      return {
        status: "success",
        message: "Resend Otp is not allowed to resend at the moment",
      };
    }

    await OTP.update(
      { is_replaced: true },
      {
        where: {
          id: otps[0].id,
        },
      },
      { transaction: transaction },
    );
    const dataBooking = await Booking.findOne({
      attributes: ["booking_date"],
      where: {
        id: dataRequest.booking_id,
      },
      include: [
        {
          model: Timeslot,
          required: true,
          attributes: ["start_time"],
        },
        {
          model: Service,
          required: true,
          attributes: ["massage_type"],
        },
        {
          model: Customer,
          required: true,
          attributes: ["phone_number"],
        },
      ],
      transaction: transaction,
    });

    await transaction.commit();
    return {
      status: "success",
      data: dataBooking,
      message: "resend OTP successfully",
    };
  } catch (error) {
    console.error(error);
    await transaction.rollback();
    return { status: "failed", message: error.message };
  }
};

const checkDataPayment = async function (dataPaymentRequest) {
  const transaction = await database_BOS.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  });
  try {
    const existingBooking = await Booking.findOne({
      attributes: ["id", "payment_code"],
      where: {
        id: {
          [Op.eq]: dataPaymentRequest.booking_id,
        },
        expires_at: {
          [Op.gte]: new Date(),
        },
      },
      transaction: transaction,
    });

    if (!existingBooking) {
      await transaction.commit();
      return {
        status: "failed",
        message: "Exisiting Booking Not Found",
      };
    }

    const notVerifiedBooking = await OTP.findOne({
      attributes: ["id"],
      where: {
        booking_id: {
          [Op.eq]: existingBooking.id,
        },
        is_verified: {
          [Op.eq]: false,
        },
      },
      transaction: transaction,
    });

    if (notVerifiedBooking) {
      await transaction.commit();
      return {
        status: "failed",
        message: "Booking is not verified yet",
      };
    }

    const dataPaymentResult = await Booking.findOne({
      attributes: ["id"],
      where: {
        id: dataPaymentRequest.booking_id,
      },
      include: [
        {
          model: Payment,
          required: true,
          attributes: ["amounts"],
        },
        {
          model: Customer,
          required: true,
          attributes: ["phone_number", "name"],
        },
      ],
      transaction: transaction,
    });

    let invalidDataPayment = {};
    if (
      dataPaymentResult.Customer.dataValues.name !== dataPaymentRequest.name
    ) {
      invalidDataPayment.name = dataPaymentRequest.name;
    }
    if (
      dataPaymentResult.Customer.dataValues.phone_number !=
      dataPaymentRequest.phone_number
    ) {
      invalidDataPayment.phone_number = dataPaymentRequest.phone_number;
    }
    if (
      dataPaymentResult.Payment.dataValues.amounts !== dataPaymentRequest.price
    ) {
      invalidDataPayment.amounts = dataPaymentRequest.price;
    }
    if (Object.keys(invalidDataPayment).length != 0) {
      await transaction.commit();
      return {
        status: "failed",
        message: { text: "Payment data is invalid", data: invalidDataPayment },
      };
    } else {
      await transaction.commit();
      return { status: "success", message: "Payment data is valid" };
    }
  } catch (error) {
    console.error(error);
    await transaction.rollback();
    return { status: "failed", message: "Payment data is invalid" };
  }
};

const paymentWebhook = async function (dataWebhook) {
  const transaction = await database_BOS.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  });

  try {
    if (
      dataWebhook.transaction_status === "capture" ||
      dataWebhook.transaction_status === "settlement"
    ) {
      console.log(`transaction successfully for ${dataWebhook.order_id}`);
      await Booking.update(
        { status: "confirmed" },
        {
          where: {
            id: dataWebhook.order_id,
          },
        },
        { lock: transaction.LOCK.UPDATE },
        { transaction: transaction },
      );
      await Payment.update(
        { status: "confirmed", payment_date_time: dataWebhook.settlement_time },
        {
          where: {
            payment_code: existingBooking.payment_code,
          },
        },
        { lock: transaction.LOCK.UPDATE },
        { transaction: transaction },
      );
      await transaction.commit();
      return { status: "success", message: "Booking completed successfully" };
    } else if (
      dataWebhook.transaction_status === "cancel" ||
      dataWebhook.transaction_status === "deny" ||
      dataWebhook.transaction_status === "expire" ||
      dataWebhook.transaction_status === "failure"
    ) {
      console.log(
        `transaction ${dataWebhook.transaction_status} for ${dataWebhook.order_id}`,
      );
      await Booking.update(
        { status: "failure", status_remark: dataWebhook.transaction_status },
        {
          where: {
            id: dataWebhook.order_id,
          },
        },
        { lock: transaction.LOCK.UPDATE },
        { transaction: transaction },
      );
      await Payment.update(
        {
          status: "failure",
          status_remark: dataWebhook.transaction_status,
          payment_date_time: dataWebhook.settlement_time,
        },
        {
          where: {
            payment_code: existingBooking.payment_code,
          },
        },
        { lock: transaction.LOCK.UPDATE },
        { transaction: transaction },
      );
      await transaction.commit();
      return { status: "failure", message: "Booking failed to complete" };
    } else {
      console.log(
        `transaction ${dataWebhook.transaction_status} for ${dataWebhook.order_id}`,
      );
      await transaction.commit();
      return {
        status: dataWebhook.transaction_status,
        message: "Booking failed to complete",
      };
    }
  } catch (error) {
    console.error(error);
    await transaction.rollback();
    return { status: "failed", message: error.message };
  }
};

module.exports = {
  database_BOS,
  holdBooking,
  savehashOTP,
  otpVerification,
  setExpiredVerification,
  otpResend,
  paymentWebhook,
  checkDataPayment,
};
