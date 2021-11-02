import {TotPlan} from '../models/TotPlan'
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    gmail: String,
    image_url: String,
    totPlan_list:[{_id: mongoose.Schema.Types.ObjectId , title: String}],
    call_list : [{
        host : String,
        plan_title : String
    }]
})

const User = mongoose.model('User', userSchema );

module.exports = {User}