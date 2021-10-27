const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    id: Number,
    name: String,
    adr: String,
    x_y: [{
        long : String,
        lat : String
    }],
    memo: String
})

const RecPlace = mongoose.model('RecPlace', placeSchema);

module.exports = {RecPlace}