const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const User = require('../models/user');

const handleErrors = (err)=>{
    //console.log(err.message, err.code);
    let errors = {success: false, username:'', email:''};
    console.log(err)

    if(err.message.includes('User validation failed')){
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

exports.signUp = async(req,res)=>{
    const newUser = User({
        username: req.body.username,
        password: await argon2.hash(req.body.password),
        email: req.body.email,
        songs_liked: [],
        following: []
    })

    newUser.save()
    .then((result)=>{
        // const token = this.createToken(newUser._id);
        // res.cookie('jwt',token,{httpOnly: true, maxAge: maxAge*1000})
        res.json({success: true, msg: 'Successful created new user.'});
    })
    .catch((err)=>{
        const errors = handleErrors(err);
        console.log(errors);
        res.json(errors);
        //return res.json({success: false, msg: 'Email already exists.'});
      })
}

const maxAge = 3 * 24 * 60 * 60;
exports.createToken = (username)=>{
    return jwt.sign({username},'secret',{
        expiresIn: maxAge
    });
}

exports.logIn = async(req,res)=>{
    const user = await User.findOne({email:{$eq:req.body.email}});
    if(user==null){
        res.send('There is no user associated with this email');
    }
    else{
        const pwdMatch = await argon2.verify(user.password,req.body.password);
        if(pwdMatch){
            console.log('username:'+user.username);
            const token = this.createToken(user.username);
            res.cookie('jwt',token,{httpOnly: true, maxAge: maxAge*1000});
            res.json({success:true, user:user.username, msg:"Login success"});
        }
        else{
            res.json({success:false, user:user.username, msg:"Login failed"});
        }
    }
}

exports.logOut = async(req, res)=>{
    res.cookie('jwt','', {maxAge:1});
    res.json('success');
}