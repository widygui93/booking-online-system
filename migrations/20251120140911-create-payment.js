"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Payments", {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      payment_date_time: {
        allowNull: true,
        type: Sequelize.DATE,
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
      amounts: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      customer_code: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      payment_code: {
        allowNull: false,
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("Payments");
  },
};
