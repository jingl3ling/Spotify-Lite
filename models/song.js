const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SongSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    artists:[{
        type: mongoose.Types.ObjectId,
        ref: 'Artist',
        required: false
    }],
    languages:[{
        type: String,
        required: true
    }],
    genre:[{
        type: String,
        required: true
    }],
    likedBy:[{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        unique: false,
        required: false
    }],
},{timestamps:true})

const Song = mongoose.model('Song',SongSchema);
module.exports = Song;