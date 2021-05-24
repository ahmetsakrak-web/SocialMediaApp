const config = require("config");
const mongoose = require("mongoose");

const DBConnect = async () => {
  try {
    await mongoose.connect(config.get("IRL"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("Database is connected successfully");
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = DBConnect;
