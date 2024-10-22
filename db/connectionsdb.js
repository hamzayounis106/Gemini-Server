import { mongoose } from "mongoose";
const options = {
  connectTimeoutMS: 70000,
  socketTimeoutMS: 70000,
};

export const connectDb = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URL, options);
    console.log("Mongo DB connected : " + con.connection.host);
  } catch (error) {
    console.log("Mongo DB connection error : " + error.message);
  }
};
