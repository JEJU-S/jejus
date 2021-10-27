const mongoose = require('mongoose');

const recplaceSchema = new mongoose.Schema({
    id: Number,
    name: String,
    road_adr: String,
    coordinates: {
        x : String,
        y : String
    },
    summary: String,
    img_url: String
})

const RecPlace = mongoose.model('RecPlace', recplaceSchema);

module.exports = {RecPlace}