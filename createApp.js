// const { database_BOS } = require("./databases/database_BOS");

const express = require("express");

// const app = express();

// app.use(express.json());

// database_BOS
//   .authenticate()
//   .then(() => {
//     console.log("connection has been established successfully");
//   })
//   .catch((err) => {
//     console.log("Unable to connect to database:", err);
//     process.exit();
//   });

// require("./routes/booking.routes")(app);

// require("./scheduler");

// app.listen("8080", () => {
//   console.log("server is stand by on port 8080");
// });

const createApp = () => {
  const app = express();
  app.use(express.json());
  require("./routes/booking.routes")(app);
  // require("./scheduler");
  return app;
};

module.exports = {
  createApp,
};
