const mongoose = require('mongoose');

const recplaceSchema = new mongoose.Schema({
    id: Number,
    name: String,
    road_adr: String,
    coordinates: {
        x : Number,
        y : Number
    },
    summary: String,
    img_url: String,
    score: Number ,
    map_link: String
})

const RecPlace = mongoose.model('RecPlace', recplaceSchema);

module.exports = {RecPlace}