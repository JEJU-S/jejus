const mongoose = require('mongoose');

const recplaceSchema = new mongoose.Schema({
    id: Number,
    name: String,
    road_adr: String,
    x : Number,
    y : Number,
    img_url: String,
    score: Number,
    map_link: String
})

const RecPlace = mongoose.model('RecPlace', recplaceSchema);

module.exports = {RecPlace};