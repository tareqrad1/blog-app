const mongoose = require("mongoose");

const ConnectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGOOSE_KEY);
    console.log('connect started to database');
  }catch (err) {
    console.log('connect error in mongoose !');
  }
};

module.exports = ConnectToDB;
