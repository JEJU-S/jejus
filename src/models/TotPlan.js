
const mongoose = require('mongoose');

const totplanSchema = new mongoose.Schema({
    title: {type: String, unique: true},
    admin: {
        _id: mongoose.Schema.Types.ObjectId,
        name: String
    },
    participants: [{
        _id: mongoose.Schema.Types.ObjectId,
        name: String,
        image_url: String
    }],
    day_plan: [{
       date: {type :Date, required:true}, 
       place: [{
           name: String,
           road_adr: String,
           // img 추가할건지 판단
           x : Number,
           y : Number,
           map_link: String
       }]
    }
    ]
})

const TotPlan = mongoose.model('TotPlan', totplanSchema );

module.exports = {TotPlan}