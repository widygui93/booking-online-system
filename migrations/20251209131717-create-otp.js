"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Otps", {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      booking_id: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      otp_hash: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      expired_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      attempts: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      is_verified: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      is_replaced: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable("Otps");
  },
};
