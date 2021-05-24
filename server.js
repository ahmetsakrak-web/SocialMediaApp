const express = require("express");
const app = express();
const DBConnect = require("./config/db");
const config = require("config");

DBConnect();
app.use(express.json());
app.use("/api/users", require("./controllers/api/users"));
app.use("/api/posts", require("./controllers/api/posts"));
app.use("/api/profile", require("./controllers/api/profiles"));
app.use("/api/auth", require("./controllers/api/auth"));

app.listen(
  config.get("PORT"),
  console.log(`The server is running on port ${config.get("PORT")}`)
);
