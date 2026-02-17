import mongoose from "mongoose";

console.log("MONGO_URL:", process.env.MONGO_URL);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB conectado");
  } catch (error) {
    console.error("Error al conectar MongoDB", error.message);
    process.exit(1);
  }
};

export default connectDB;