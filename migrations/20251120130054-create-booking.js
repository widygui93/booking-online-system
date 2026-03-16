"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Bookings", {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      booking_created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      booking_date: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
      customer_code: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      room_id: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      therapist_id: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      timeslot_code: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      payment_code: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      massage_code: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      status_remark: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      expires_at: {
        allowNull: false,
        type: Sequelize.DATE,
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
    await queryInterface.dropTable("Bookings");
  },
};
