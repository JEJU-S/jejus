const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    gmail: {type: String, required: true, unique: true},
    image_url: String,
    totPlan_id: [mongoose.Schema.Types.ObjectId]
})

const User = mongoose.model('User', userSchema );

module.exports = {User}