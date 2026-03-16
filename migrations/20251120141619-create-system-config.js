"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("System_configs", {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      session_duration_minutes: {
        allowNull: false,
        type: Sequelize.DECIMAL,
      },
      buffer_time_minutes: {
        allowNull: false,
        type: Sequelize.DECIMAL,
      },
      work_start_time: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      work_end_time: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      lunch_break_start: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      lunch_break_end: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      dinner_break_start: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      dinner_break_end: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      total_rooms: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      total_therapists: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      expired_minutes_otp: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      max_attempts_otp: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      expired_minutes_payment: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("System_configs");
  },
};
