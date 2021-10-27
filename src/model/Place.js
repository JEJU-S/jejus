const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    id: Number,
    name: String,
    road_adr: String,
    coordinates: {
        x : String,
        y : String
    }
})

const RecPlace = mongoose.model('RecPlace', placeSchema);

module.exports = {RecPlace}