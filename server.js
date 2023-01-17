var express = require('express');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
require('dotenv').config()
var app = express();
app.set('view engine','ejs');
app.use('/',express.json());
const {requireAuth, checkUser} = require('./middleware/authMiddleware')

const path = require('path');
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use(express.static("public"));
app.use(session({
    secret: "secret",
    cookie: {
        httpOnly: true,
        secure: true,
        proxy: true,
        resave: true,
        saveUnintialized: true
    }
})
)

const UserRouter=require('./routes/UserRouter');
const SongRouter=require('./routes/SongRouter');
const AuthRouter=require('./routes/AuthRouter');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.get('*',checkUser);
app.use('/songs',SongRouter);
app.use('/user', AuthRouter);
app.use('/profile', requireAuth, UserRouter);


const dbURI = 'mongodb+srv://jingl3ling:huangxingzi9@cluster0.p7gyqib.mongodb.net/spotify-lite?retryWrites=true&w=majority';
mongoose.set('strictQuery', true);
mongoose.connect(dbURI)
.then((result)=>
    app.listen(3001, function () {
      console.log('App listening on port 3001.')
    }))
.catch((err)=>console.log(err))

var song=[];

app.get("/", function(req, res) {    
    res.render("index.ejs",{ song: song});
});

app.get("/error", function(req, res) {    
    res.render("error.ejs");
});


app.get("*",(req,res)=>{
    res.status(400).json("error");
})

module.exports = {app};