const User = require('../models/user');
const Song = require("../models/song")
const Artist = require("../models/artist");
const mongoose = require('mongoose');
const argon2 = require('argon2');

var song=[];
var following=[];
var songs = [];
var artists = [];

const handleErrors = (err)=>{
  //console.log(err.message, err.code);
  let errors = {success: false, username:'', email:''};
  //console.log(err);
  if(err.message.includes('Validation failed')){
      Object.values(err.errors).forEach(({properties})=>{
          errors[properties.path] = properties.message;
      });
  }
  else if(err.message.includes('E11000 duplicate key error collection:')){
      if(err.keyPattern.username){
          errors['username']= 'Username already existed';
      }        
      if(err.keyPattern.email){
          errors['email']= 'Email already existed';
      }
  }
  return errors;
}

Song.find()
    .then((result)=>{
        for(let i=0 ;i<result.length; i++){
            songs.push(result[i].title);
        }
        console.log(songs);
    })

Artist.find()
.then((result)=>{
    for(let i=0 ;i<result.length; i++){
        artists.push(result[i].name);
    }
    console.log(artists);
})

exports.getUser = async(req, res) => {  
    let param = req.params;  
    var user = param.user;
    console.log(res.locals.user[0].username);
    if(res.locals.user[0].username===user){
      User.find({username:{$eq:user}})
      .then((result)=>{
        if(result.length>0){
            res.render("user.ejs",{ user:user, song:song, following:following, songs:songs, artists:artists});
            song=[];
            following=[];
        }
        else{
            res.send('user do not exsit')
        }
      })
      .catch((err)=>{
        console.log(err);
      })
    }
    else{
      res.redirect('/error');  
    }
};

exports.getLikedSongs = async(req,res)=>{
    song=[];
    let param = req.params;  
    var user = param.user;
    var ids=[];
    User.find({username:{$eq:user}})
      .then((result)=>{
        for(let i=0; i<result[0].songs_liked.length; i++){
          ids.push(result[0].songs_liked[i]);
         }
         Song.find({ _id:{$in:ids}})
         .then((result)=>{
             for(let i=0; i<result.length; i++){
                 song.push(result[i].title);
             }
             //res.status(200).json('success');
         })
      })
      .catch((err)=>{
        console.log(err);
        //res.status(400).json('failed');
      })

}

exports.getFollowingArtists = async(req,res)=>{
    following=[];
    let param = req.params;  
    var user = param.user;
    var ids=[];
    User.find({username:{$eq:user}})
      .then((result)=>{
        for(let i=0; i<result[0].following.length; i++){
            ids.push(result[0].following[i]);
           }
           Artist.find({ _id:{$in:ids}})
           .then((result)=>{
               for(let i=0; i<result.length; i++){
                   following.push(result[i].name);
               }
           })
      })
      .catch((err)=>{
        console.log(err);
      })
}

exports.likeSong = async(req,res)=>{
    let param = req.params;  
    var song = param.song;   
    var user = param.user;

    var user_id;
    var song_id;

    User.find({username:{$eq:user}})
      .then((result)=>{
        user_id=result[0]._id;
        console.log(user_id);

        Song.updateOne({title:{$eq:song}},{$addToSet:
            {likedBy:user_id}})
            .then((result)=>{
          })
      })
      .catch((err)=>{
        console.log(err);
      })

    Song.find({title:{$eq:song}})
      .then((result)=>{
        song_id=result[0]._id;
        console.log(song_id);

        User.updateOne({username:{$eq:user}},{$addToSet:
            {songs_liked:song_id}})
            .then((result)=>{
            })
      })
      .catch((err)=>{
        console.log(err);
        res.json({success:false});
      })

      res.json({success:true});
}

exports.followArtist = async(req,res)=>{
    let param = req.params;  
    var artist = param.artist;   
    var user = param.user;

    var user_id;
    var artist_id;

    User.find({username:{$eq:user}})
    .then((result)=>{
        user_id=result[0]._id;

        Artist.updateOne({name:{$eq:artist}},{$addToSet:
            {followers:user_id}})
            .then((result)=>{
                // res.send('success');
            })
    })
    .catch((err)=>{
        console.log(err);
    })

    Artist.find({name:{$eq:artist}})
    .then((result)=>{
        artist_id=result[0]._id;

        User.updateOne({username:{$eq:user}},{$addToSet:
            {following:artist_id}})
            .then((result)=>{
              res.json({success:true});
            })
    })
    .catch((err)=>{
        console.log(err);
        res.json({success:false});
    })
}

exports.editProfile = async(req,res)=>{
    let old_username = req.body.old_username;
    let new_username = req.body.new_username;
    let password = await argon2.hash(req.body.password);
    let email = req.body.email;

    console.log(req.body);

    User.updateOne({username:{$eq:old_username}},{$set:
        {username:new_username,password: password,
            email: email}},{ runValidators: true })
        .then((result)=>{
          res.json({success: true, msg: 'Successful updated profile.'});
        })
        .catch((err)=>{
          const errors = handleErrors(err);
          console.log(errors);
          res.json(errors);
        })

}

