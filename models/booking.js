"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Booking.init(
    {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      booking_created_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      booking_date: {
        allowNull: false,
        type: DataTypes.DATEONLY,
      },
      customer_code: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      room_id: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      therapist_id: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      timeslot_code: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      payment_code: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      massage_code: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      status: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      status_remark: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      expires_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Booking",
    }
  );
  return Booking;
};
