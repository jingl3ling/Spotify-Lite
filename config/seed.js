const mongoose = require('mongoose');
const Song = require('../models/song');
const Artist = require('../models/artist');

const dbURI = 'mongodb+srv://jingl3ling:huangxingzi9@cluster0.p7gyqib.mongodb.net/spotify-lite?retryWrites=true&w=majority';
mongoose.set('strictQuery', true);

// const reset = async ()=>{
//     try{
//     }
//     catch(err){
//         console.log(err);        
//     }
// }

const connect = async ()=>{
    try{
        await mongoose.connect(dbURI);
        const artist1 = await Artist.create({
            name: "artist1",
            followers: []
        });
        const artist2 = await Artist.create({
            name: "artist2",
            followers: []
        });
        const artist3 = await Artist.create({
            name: "artist3",
            followers: []
        });
        const song1 = await Song.create({
            title: "song1",
            artists: artist1,
            languages:["english","chinese"],
            genre: ["pop"],
            likedBy:[]         
        });
        const song2 = await Song.create({
            title: "song2",
            artists: artist2,
            languages:["english"],
            genre: ["jazz"],
            likedBy:[]         
        });
        const song3 = await Song.create({
            title: "song3",
            artists: artist3,
            languages:["korean"],
            genre: ["kpop"],
            likedBy:[]         
        });
        console.log(song1);
        artist1.save();
        song1.save();
        console.log('hi');
    }
    catch(err){
        console.log(err);
    }
}

const close = async()=>{
    try{
        mongoose.connection.close();
    }
    catch(err){
        console.log(err);
    }  
}

connect();
// close();
