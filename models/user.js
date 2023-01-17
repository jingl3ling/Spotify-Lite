const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {isEmail} = require('validator');

const UserSchema = new Schema({
    username:{
        type: String,
        unique: [true, 'Username already exsited'],
        required: [true, 'Please enter a username']
    },
    password:{
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters'],
    },
    email:{
        type: String,
        unique: [true, 'Email already exsited'],
        required: [true, 'Please enter a email'],
        validate: [isEmail, 'Please enter a valid email']
    },
    songs_liked:[{     
        type: mongoose.Types.ObjectId,
        ref: 'Song',
        unique: false,
        required: false
    }],
    following:[{
        type: mongoose.Types.ObjectId,
        ref: 'Artist',
        unique: false,
        required: false
    }],
},{timestamps:true})

const User = mongoose.model('User',UserSchema);
module.exports = User;