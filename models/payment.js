"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Payment.init(
    {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      payment_date_time: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      expires_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      status: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      status_remark: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      amounts: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      customer_code: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      payment_code: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Payment",
    }
  );
  return Payment;
};
