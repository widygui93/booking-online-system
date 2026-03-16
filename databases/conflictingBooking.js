const { Op } = require("sequelize");
// Final verification: Double-check that the selected room  and the selected therapist isn't taken
// This is an extra safety measure in case of edge cases
const conflicted = async (
  Booking,
  timeslot_code,
  selectedRoomID,
  selectedTherapistID,
  transaction,
  currentDateTime = new Date(),
) => {
  return await Booking.findOne({
    attributes: ["id"],
    where: {
      timeslot_code: timeslot_code,
      [Op.or]: [
        { room_id: selectedRoomID },
        { therapist_id: selectedTherapistID },
      ],
      status: {
        [Op.in]: ["confirmed", "pending_verification", "pending_payment"],
      },
      expires_at: {
        // [Op.gte]: new Date(),
        [Op.gte]: currentDateTime,
      },
    },
    lock: transaction.LOCK.UPDATE,
    transaction: transaction,
  });
};

module.exports = {
  conflicted,
};
