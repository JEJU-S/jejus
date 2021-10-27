const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    road_adr: String,
    coordinates: {
        x : Number,
        y : Number
    }
})

const RecPlace = mongoose.model('RecPlace', placeSchema);

module.exports = {RecPlace}