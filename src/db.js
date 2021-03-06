import mongoose from "mongoose";
import dotdev from "dotenv";
import genericPool from "generic-pool";
import { MongoClient } from "mongoose/node_modules/mongodb";

dotdev.config();

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true, //deprecatedError 발생 방지
    useUnifiedTopology: true, // 
    dbName: "jeju_plan" // 이 이름으로 db가 생성됩니다.
  });

const db = mongoose.connection;

const handleOpen = () => console.log("Connected to DB✅!");
const handleError = (error) => console.log("❌DB ERROR", error);
db.on("error", handleError);
db.once("open", handleOpen)


