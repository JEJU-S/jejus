import {TotPlan} from '../models/TotPlan'
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    gmail: String,
    image_url: String,
    totPlan_list:[{_id: mongoose.Schema.Types.ObjectId, title: String}],
    call_list : [{
        _id: false,
        host : String,
        plan_title : String,
        plan_id : mongoose.Schema.Types.ObjectId
    }]
})

const User = mongoose.model('User', userSchema );

module.exports = {User}