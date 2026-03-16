"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class System_config extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  System_config.init(
    {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      session_duration_minutes: {
        allowNull: false,
        type: DataTypes.DECIMAL,
      },
      buffer_time_minutes: {
        allowNull: false,
        type: DataTypes.DECIMAL,
      },
      work_start_time: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      work_end_time: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      lunch_break_start: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      lunch_break_end: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      dinner_break_start: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      dinner_break_end: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      total_rooms: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      total_therapists: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      expired_minutes_otp: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      max_attempts_otp: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      expired_minutes_payment: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "System_config",
    }
  );
  return System_config;
};
