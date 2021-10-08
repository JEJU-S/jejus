import mongoose from "mongoose";
import dotdev from "dotenv";
import genericPool from "generic-pool";

dotdev.config();

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;

const handleOpen = () => console.log("Connected to DB✅!");
const handleError = (error) => console.log("❌DB ERROR", error);
db.on("error", handleError);
db.once("open", handleOpen)


