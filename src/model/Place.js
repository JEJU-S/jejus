const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    id: Number,
    name: String,
    road_adr: String,
    coordinates: {
        x : Number,
        y : Number
    }
})

const RecPlace = mongoose.model('RecPlace', placeSchema);

module.exports = {RecPlace}