import dotenv from "dotenv";
import connectDB from "./config/db";
import { app } from "./app";
dotenv.config();

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error");
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Listening at port ${process.env.PORT}`);
    });
  })
  .catch((e) => {
    console.log("Connection error");
  });
