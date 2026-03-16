"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Otp extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Otp.init(
    {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      booking_id: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      otp_hash: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      expired_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      attempts: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      is_verified: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
      is_replaced: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      modelName: "Otp",
    }
  );
  return Otp;
};
