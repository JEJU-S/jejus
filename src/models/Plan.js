import mongoose, { Schema, SchemaTypes } from "mongoose";

const planSchema = new mongoose.Schema({
    owner : String,
    title : String,
    start_date : Date,
    end_date : Date,
    place_id : [{type:Schema.Types.ObjectId}],
});

//(String, schema)
const Plan = mongoose.model("Plan", planSchema);
export default Plan;