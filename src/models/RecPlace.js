const mongoose = require('mongoose');
// 데이터셋에 맞춰 바뀔예정
const recplaceSchema = new mongoose.Schema({
    idx : Number,
    category : String,
    section : String, 
    name : String,
    map_link: String,
    road_adr : String,
    y : Number,
    x : Number,
    image_url: String,
    score: Number,
    model_score : Number,
    rank_index : Number,
    model_rank : String, // ABCD
})

const RecPlace = mongoose.model('RecPlace', recplaceSchema);

module.exports = {RecPlace};