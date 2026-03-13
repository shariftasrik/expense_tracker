import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(process.env.dbURL)
    .then(() => console.log("DB Connected"));
};
