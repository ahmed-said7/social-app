let User=require('../models/userModel');
let handler=require('express-async-handler');
const apiError = require('../utils/apiError');
let jwt=require('jsonwebtoken');
let bcrypt=require('bcryptjs');
let transport=require('../utils/sendToEmail');
const { response } = require('express');
require('dotenv').config({path:'./environ.env'});

let login=handler(
    async(req,res,next)=>{
        let {email,username,password}=req.body;
        let user=await User.findOne({$or:[{username},{email}]});
        if(!user){
            return next(new apiError('User not found please signup',400));
        };
        let validation=await bcrypt.compare(user.password,password);
        if(!validation){
            return next(new apiError('Password or email not correct',400));
        };
        user.Logout=undefined;
        await user.save();
        let token=jwt.sign({userId:user._id},process.env.SECRET,{expiresIn:'3d'});
        res.status(200).json({token,user,status:'ok'});
    }
);

let signup=handler(
    async(req,res,next)=>{
        let {username,email}=req.body;
        let user=await User.find({$or:[{email},{username}]});
        console.log(user);
        if(user){
            if(user.username==username){
                return next(new apiError('username should be unique',400));
            }else if(user.email==email){
                return next(new apiError('email should be unique',400));
            };
        };
        user=await User.create(req.body);
        user.Logout=undefined;
        await user.save();
        let token=jwt.sign({userId:user._id},process.env.SECRET,{expiresIn:'3d'});
        res.status(200).json({token,user,status:'ok'});
    }
);

let protected=handler(
    async(req,res,next)=>{
        let token;
        if(req.headers.authorization){
            token=req.headers.authorization.split(' ')[1];
        };
        if(!token){
            return next(new apiError('provide token',400))
        };
        let decoded=jwt.verify(token,process.env.SECRET);
        let user=await User.findById(decoded.userId);
        if(!user){
            return next(new apiError('no user found for token',400));
        };
        if(user.passwordChangedAt){
            let stamps=Math.floor(user.passwordChangedAt/1000);
            if(stamps>decoded.iat){
                return next(new apiError('password changed at',400));
            };
        };
        if(user.Logout){
            return next(new apiError('user Loggedout',400));
        };
        req.user = user;
        next();
    }
);

let allowedTo=(...roles)=> handler(async(req,res,next)=>{
    if(!roles.includes(req.user.role)){
        return next(new apiError('you are not allowed to access this route',400))
    };
    next();
});

let forgetPassword=handler(async(req,res,next)=>{
    let {email}=req.body.email;
    let user=await User.findOne({email});
    if(!user){
        return next(new apiError('no user found for email',400));
    };
    let resetCode=`${Math.floor(Math.random()*899999+100000)}`;
    user.passwordResetCode=await bcrypt.hash(resetCode,12);
    user.passwordResetCodeExpiredAt=Date.now()+10*60*1000;
    user.passwordVertifyResetCode=false;
    let options={
        from:"<social-app",
        to:user.email,
        message:`your verification code to change password is ${resetCode}`,
        subject:`hi ${user.name}`
    };
    try{
        transport.sendMail(options);
    }catch(err){
        console.log(err);
        user.passwordResetCode=undefined;
        user.passwordResetCodeExpiredAt=undefined;
        user.passwordVertifyResetCode=undefined;
    };
    await user.save();
    console.log(user);
    res.status(200).json({status:"success"});
});
let vertifyResetCode=handler(async(req,res,next)=>{
    let {email,resetCode}=req.body.email;
    let user=await User.findOne({email});
    if(!user){
        return next(new apiError('no user found for email',400));
    };
    let valid=await bcrypt.compare(user.passwordResetCode,resetCode);
    if(Date.now()>user.passwordResetCodeExpiredAt){
        return next(new apiError('password resetCode has been expired',400));
    };
    if(!valid){
        return next(new apiError('password resetCode is not true',400));
    };
    user.passwordResetCode=undefined;
    user.passwordResetCodeExpiredAt=undefined;
    user.passwordVertifyResetCode=true;
    await user.save();
    res.status(200).json({status:"success"});
});
let changePassword=handler(
    async(req,res,next)=>{
    let {email,password,passwordConfirm}=req.body.email;
    if(passwordConfirm !== password){
        return next(new apiError('passwordConfirm is not correct',400));
    };
    let user=await User.findOne({email});
    if(!user){
        return next(new apiError('no user found for email',400));
    };
    if(!user.passwordVertifyResetCode){
        return next(new apiError('password resetCode is not true',400));
    }
    user.password=await bcrypt.hash(password,12);
    user.passwordVertifyResetCode=undefined;
    await user.save();
    let token=jwt.sign({userId:user._id},process.env.SECRET,{expiresIn:'3d'});
    res.status(200).json({status:"success",token});
    }
)
module.exports={protected,signup,login,allowedTo,forgetPassword,vertifyResetCode,changePassword};