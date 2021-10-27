const mongoose = require('mongoose');

const recplaceSchema = new mongoose.Schema({
    id: Number,
    name: String,
    adr: String,
    x_y: [{
        long : String,
        lat : String
    }],
    summary: String,
    img_url: String
})

const RecPlace = mongoose.model('RecPlace', recplaceSchema);

module.exports = {RecPlace}