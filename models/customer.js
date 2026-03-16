"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Customer.init(
    {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      phone_number: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      is_guest: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
      password: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      customer_code: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Customer",
    }
  );
  return Customer;
};
