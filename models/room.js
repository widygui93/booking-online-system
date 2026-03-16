"use strict";
const { Model } = require("sequelize");
// const { Sequelize } = require(".");
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Room.init(
    {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      room_number: {
        allowNull: false,
        type: DataTypes.DECIMAL,
      },
      is_active: {
        allowNull: true,
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      modelName: "Room",
    }
  );
  return Room;
};
