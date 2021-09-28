import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id : {type : String, required : true, unique : true},
    image_url : {type : String},
    gmail : {type : String, required : true, unique : true},
    name : {type : String, required : true},
    plan_id : [{type:Schema.Types.ObjectId}],
});

const User = mongoose.model("User", userSchema);
export default User;