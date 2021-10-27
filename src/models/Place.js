const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    road_adr: String,
    coordinates: {
        x : Number,
        y : Number
    },
    map_link: String
})

const Place = mongoose.model('Place', placeSchema);

module.exports = {Place}