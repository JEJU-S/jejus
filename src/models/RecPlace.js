const mongoose = require('mongoose');
// 데이터셋에 맞춰 바뀔예정
const recplaceSchema = new mongoose.Schema({
    id: Number,
    category : String,
    section : String, 
    name: String,
    road_adr: String,
    x : Number,
    y : Number,
    img_url: String,
    score: Number,
    model_score : Number,
    map_link: String,
    img_link: String, 

})

const RecPlace = mongoose.model('RecPlace', recplaceSchema);

module.exports = {RecPlace};