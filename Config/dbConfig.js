const mongoose = require("mongoose");
require("dotenv").config();


const mongoURL = process.env.MONGODB_URL;
const connectionParams={
    useNewUrlParser: true,
    useUnifiedTopology: true 
}

const connectDB = async () => {
  mongoose.set("strictQuery", false);
  await mongoose.connect(mongoURL,connectionParams);
  console.log("MongoDB connected");
};

module.exports = connectDB;
