const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    followers:[{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        unique: false,
        required: false
    }],
},{timestamps:true})

const Artist = mongoose.model('Artist',ArtistSchema);
module.exports = Artist;