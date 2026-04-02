"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes,
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.booking = require("./booking")(sequelize, Sequelize.DataTypes);
db.customer = require("./customer")(sequelize, Sequelize.DataTypes);
db.payment = require("./payment")(sequelize, Sequelize.DataTypes);
db.room = require("./room")(sequelize, Sequelize.DataTypes);
db.service = require("./service")(sequelize, Sequelize.DataTypes);
db.system_config = require("./system_config")(sequelize, Sequelize.DataTypes);
db.therapist = require("./therapist")(sequelize, Sequelize.DataTypes);
db.timeslot = require("./timeslot")(sequelize, Sequelize.DataTypes);
db.otp = require("./otp")(sequelize, Sequelize.DataTypes);

db.booking.hasMany(db.otp, { foreignKey: "booking_id" });
db.otp.belongsTo(db.booking, { foreignKey: "id" });

db.customer.hasMany(db.booking);
db.booking.belongsTo(db.customer, {
  targetKey: "customer_code",
  foreignKey: "customer_code",
});

db.payment.hasOne(db.booking);
db.booking.belongsTo(db.payment, {
  targetKey: "payment_code",
  foreignKey: "payment_code",
});

db.timeslot.hasMany(db.booking);
db.booking.belongsTo(db.timeslot, {
  targetKey: "timeslot_code",
  foreignKey: "timeslot_code",
});

db.service.hasMany(db.booking);
db.booking.belongsTo(db.service, {
  targetKey: "massage_code",
  foreignKey: "massage_code",
});

module.exports = db;
