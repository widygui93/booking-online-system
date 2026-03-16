const { database_BOS } = require("./databases/database_BOS");
const { createApp } = require("./createApp.js");

database_BOS
  .authenticate()
  .then(() => {
    console.log("connection has been established successfully");
  })
  .catch((err) => {
    console.log("Unable to connect to database:", err);
    process.exit();
  });

const app = createApp();

app.listen("8080", () => {
  console.log("server is stand by on port 8080");
});
