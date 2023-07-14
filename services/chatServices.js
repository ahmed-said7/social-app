let Chat=require('../models/chatModel');
let User=require('../models/userModel');
let handler=require('express-async-handler');
const apiError = require('../utils/apiError');
let bcrybt=require('bcryptjs');
let jwt=require('jsonwebtoken');
require('dotenv').config({path:'./environ.env'});

let createChat=handler(async (req,res,next)=>{
    req.body.members.push(req.user._id.toString());
    let chat=await Chat.create(req.body);
    res.status(200).json({status:'success',chat});
});

let getChats=handler(async (req,res,next)=>{
    let chat=await Chat.find({members:{$all:[req.user._id]}}).populate({path:"members",select:"name email"});
    if(!chat){
        return next(new apiError('chat Not Found',400));
    };
    res.status(200).json({status:'success',chat});
});

let getChat=handler(async (req,res,next)=>{
    let chat=await Chat.find({_id:req.params.id,members:{$all:[req.user._id]}})
        .populate({path:"members",select:"name email"});
    if(!chat){
        return next(new apiError('chat Not Found',400));
    }
    res.status(200).json({status:'success',chat});
});

let deleteChat=handler(async (req,res,next)=>{
    let chat=await Chat.findOneAndDelete({_id:req.params.id,members:{$all:[req.user._id]}});
    if(!chat){
        return next(new apiError('not found',400));
    };
    res.status(200).json({status:'success',chat});
});

let removeMemberFromChat = handler(async (req, res,next) => {
    let {memberId}=req.body;
    let chat=await Chat.findOne({_id:req.params.id,members:{$all:[req.user._id]}});
    if(!chat){
        return next(new apiError('not found',400));
    };
    let length=chat.members.length;
    if(chat.members[length-1]!==req.user._id.toString()){
        return next(new apiError('you are not allowed',400));
    };
    await Chat.findByIdAndUpdate(req.params.id,{$pull:{members:memberId}});
    res.status(200).json({status:"member removed"});
});

let addMemberToChat = handler(async (req, res,next) => {
    let {memberId}=req.body;
    let chat=await Chat.findOne({_id:req.params.id,members:{$all:[req.user._id]}});
    if(!chat){
        return next(new apiError('not found',400));
    };
    let length=chat.members.length;
    if(chat.members[length-1]!==req.user._id.toString()){
        return next(new apiError('you are not allowed',400));
    };
    chat.members.unshift(memberId);
    await chat.save();
    res.status(200).json({status:"member removed"});
});


module.exports={createChat,getChats,getChat,deleteChat,removeMemberFromChat,addMemberToChat};