

// export default connectDB;
import mongoose from 'mongoose';
import { config } from "dotenv";
config({ path: "../config/.env" });

const connectDB = async (retries = 100, delay = 5000) => {
  while (retries) {
    try {
      await mongoose.connect(process.env.DATABASE_URL || "mongodb://0.0.0.0:27017/test");
      console.log("Connected To Coonex Database");
      break; // Exit the loop if the connection is successful
    } catch (err) {
      console.log(`Failed to connect to Coonex Database. Retries left: ${retries - 1}`);
      console.log(err);
      retries -= 1; // Decrease the retry count
      if (!retries) {
        console.log("Could not connect to the database. Exiting...");
        process.exit(1); // Exit the process if out of retries
      }
      console.log(`Retrying in ${delay / 1000} seconds...`);
      await new Promise(res => setTimeout(res, delay)); // Wait before retrying
    }
  }
};

export default connectDB;
