var cookies = require('cookie-parser');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const requireAuth = (req,res,next) =>{
    const token = req.cookies.jwt;
    //console.log(token);
    if(token){
        jwt.verify(token, 'secret', (err,decodedToken)=>{
            if(err){
                res.redirect('/error');                
            }
            else{
                next();
            }
        })
    }
    else{
        res.redirect('/error');
    }
}

const checkUser = (req,res,next)=>{
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, 'secret', async(err,decodedToken)=>{
            if(err){
                res.locals.user = null;
                next();             
            }
            else{
                console.log(decodedToken);
                let user = await User.find({username:{$eq:decodedToken.username}});
                res.locals.user = user;
                //console.log(res.locals.user);
                next();
            }
        })
    }
    else{
        res.locals.user = null;
        next();
    }
}

module.exports = {requireAuth, checkUser};