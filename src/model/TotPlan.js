const mongoose = require('mongoose');

const totplanSchema = new mongoose.Schema({
    title: String,
    admin: {
        _id: mongoose.Schema.Types.ObjectId,
        name: String
    },
    participants: [{
        _id: mongoose.Schema.Types.ObjectId,
        name: String
    }],
    day_plan: [{
       date: Date,
       place: [{
           name: String,
           road_adr: String,
           coordinates: {
            x : Number,
            y : Number
        }
       }]
    }
    ]
})

const TotPlan = mongoose.model('TotPlan', totplanSchema );

module.exports = {TotPlan}