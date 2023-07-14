

let User=require('../models/userModel');
let handler=require('express-async-handler');
const apiError = require('../utils/apiError');
let bcrybt=require('bcryptjs');
let jwt=require('jsonwebtoken');

require('dotenv').config({path:'./environ.env'});


let createUser=handler(async(req,res,next)=>{
    let user=await User.create(req.body);
    res.status(200).json({status: 'success',user})
});

//  api/v1/users/addfriend/:id

let addFriend=handler(async(req,res,next)=>{
    let friend=await User.findOne({_id:req.params.id,followers:{$all:[req.user._id.toString()]}});
    if(friend){
        return next(new apiError('you have already add him to friends list'));
    };
    friend=await User.findByIdAndUpdate(req.params.id,{$push:{followers:req.user._id}},{new:true}).
                select('following followers').
                populate([{path:"following",select:"name email"},{path:"followers",select:"name email"}]);
    let user=await User.findByIdAndUpdate(req.user._id, {$push:{following:req.params.id}},{new:true}).
                select('following followers').
                populate([{path:"following",select:"name email"},{path:"followers",select:"name email"}])
    res.status(200).json({status: 'success',user,friend});
});


let removeFriend=handler(async(req,res,next)=>{
    let friend=await User.findOne({_id:req.params.id,followers:{$all:[req.user._id.toString()]}});
    if(!friend){
        return next(new apiError('he is not a friend'));
    };
    friend=await User.findByIdAndUpdate(friend._id,{$pull:{followers:req.user._id.toString()}},{new:true}).
                select('following followers').
                populate([{path:"following",select:"name email"},{path:"followers",select:"name email"}]);
    let user=await User.findByIdAndUpdate(req.user._id,{$pull:{following:req.params.id}},{new:true}).
                select('following followers').
                populate([{path:"following",select:"name email"},{path:"followers",select:"name email"}]);
    res.status(200).json({status: 'success',user,friend});
});

let getUsers=handler(async(req,res,next)=>{
    let search={};
    if(req.query.keyword){
        search.username={$rejex:req.query.keyword};
    };
    let users=await User.find(search).sort('-createdAt').select('-password -logout')
        .populate([{path:"following",select:"name email"},{path:"followers",select:"name email"}]);
    res.status(200).json({status: 'success',users});
});


let getUser=handler(async(req,res,next)=>{
    let user=await User.findById(req.params.id)
        .populate([{path:"following",select:"name email"},{path:"followers",select:"name email"}]);
    res.status(200).json({status: 'success',user});
});


let getLoggedUser=handler(async(req,res,next)=>{
    let user=await User.findOne({email:req.user.email}).
        populate([{path:"following",select:"name email"},
        {path:"followers",select:"name email"}])
    res.status(200).json({status: 'success',user});
});


let deleteLoggedUser=handler(async(req,res,next)=>{
    let user=await User.findByIdAndDelete(req.user._id);
    res.status(200).json({status: 'success'});
});


let updateLoggedUser=handler(async(req,res,next)=>{
    let user=await User.findByIdAndUpdate(req.user._id,req.body,{new:true});
    res.status(200).json({status: 'success',user});
});


let updateLoggedUserPassword=handler(async(req,res,next)=>{
    let password=await bcrybt.hash(req.body.password,12);
    let passwordChangedAt=Date.now();
    let user=await User.findByIdAndUpdate(req.user._id,{password,passwordChangedAt},{new:true});
    res.status(200).json({status: 'success',user});
});

let logoutLoggedUser=handler(
    async(req,res,next)=>{
    await User.findByIdAndUpdate(req.user._id,{Logout:true},{new:true});
    res.status(200).json({result:"logged out"});
});


module.exports={removeFriend,addFriend,createUser,getUsers,getUser,logoutLoggedUser
    ,getLoggedUser,deleteLoggedUser,updateLoggedUser,updateLoggedUserPassword};