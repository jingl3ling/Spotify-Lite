const User = require('../models/user');
const Song = require("../models/song")
const Artist = require("../models/artist");

var song_search = [];
var songs = [];
var artists = [];

// Song.find()
//     .then((result)=>{
//         for(let i=0 ;i<result.length; i++){
//             songs.push(result[i]);
//         }
//     })

exports.browseSongs = async(req,res)=>{
    let query = req.query;
    var language = query.language;
    
    if(language=='chinese'||language=='english'){
      songs=[];
      artists=[];
      Song.find({ languages:{$eq:language}})
      .then((result)=>{
          for(let i=0 ;i<result.length; i++){
            //console.log(i + result[i].artists)
              Artist.find({_id:{$in:result[i].artists}})
              .then((result)=>{
                  var curr_artists=[];
                  for(let i=0; i<result.length; i++){
                    curr_artists.push(result[i].name);
                  }
                  artists.push(curr_artists);
              })
              songs.push(result[i]);
          }
          //res.render("song.ejs",{ song_search:song_search, songs:songs});   
      })      
    }
    res.render("song.ejs",{ songs:songs, artists:artists});    
    songs=[];
}

exports.searchSong = async(req,res)=>{
    let param = req.params;  
    var search = param.search;
    console.log(search);
    songs=[];
    artists=[];
    Song.find({$or:[{title:{$eq:search}},{genre:{$eq:search}},{artist:{$eq:search}}]})
      .then((result)=>{
        for(let i=0; i<result.length; i++){
          songs.push(result[i]);
          Artist.find({_id:{$in:result[i].artists}})
          .then((result)=>{
              var curr_artists=[];
              for(let i=0; i<result.length; i++){
                curr_artists.push(result[i].name);
              }
              artists.push(curr_artists);
          })
         }
      })
      .catch((err)=>{
        console.log(err);
      })
    songs=[]
}