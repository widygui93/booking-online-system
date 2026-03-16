"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.bulkInsert("system_configs", [
      {
        id: "8e833636-62de-43cf-a7d7-675714df4b1e",
        session_duration_minutes: 45,
        buffer_time_minutes: 10,
        work_start_time: "08:00",
        work_end_time: "22:00",
        lunch_break_start: "12:25",
        lunch_break_end: "13:25",
        dinner_break_start: "18:00",
        dinner_break_end: "19:00",
        total_rooms: 10,
        total_therapists: 10,
        expired_minutes_otp: 5,
        max_attempts_otp: 5,
        expired_minutes_payment: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.bulkDelete("system_configs", null, {});
  },
};
