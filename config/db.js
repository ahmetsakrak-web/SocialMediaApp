const config = require("config");
const mongoose = require("mongoose");

const IRL = config.get("MONGODB");

const DBConnect = async () => {
  try {
    await mongoose.connect(IRL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("Database is Connected");
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = DBConnect;
