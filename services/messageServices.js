let Message=require('../models/messageModel');
let Chat=require('../models/chatModel');
let handler=require('express-async-handler');
const apiError = require('../utils/apiError');
let bcrybt=require('bcryptjs');
let jwt=require('jsonwebtoken');
require('dotenv').config({path:'./environ.env'});
let sharp=require('sharp');
let uuid=require('uuid');




let createMessage=handler(async(req,res,next)=>{
    req.body.sender=req.user._id;
    let chat=await Chat.findById(req.body.chatId);
    if(!chat){
        return next(new apiError('chat Not Found',400));
    };
    req.body.recipient=chat.members.filter((member)=> member !== req.user._id.toString());
    let message=await Message.create(req.body);
    res.status(200).json({message,status:"success"});
});

let getChatMessages=handler(async(req,res,next)=>{
    req.body.sender=req.user._id;
    let chatId=req.params.chatId;
    let messages=await Message.find({chatId}).
        populate({path:'sender',select:"name email"}).
        populate({path:'recipient',select:"name email"});
    if(!messages){
        return next(new apiError('Not Found',400));
    };
    res.status(200).json({messages,status:"success"});
});

let updateMessage=handler(async(req,res,next)=>{
    let message=await Chat.findOneAndUpdate({_id:req.params.id,sender:req.user._id}
        ,req.body,{new:true}).
        populate({path:'sender',select:"name email"}).
        populate({path:'recipient',select:"name email"});
    if(!message){
        return next(new apiError('Not Found',400));
    };
    res.status(200).json({message,status:"success"});
});

let deleteMessage=handler(async(req,res,next)=>{
    let message=await Chat.findOneAndDelete({_id:req.params.id,sender:req.user._id});
    if(!message){
        return next(new apiError('Not Found',400));
    };
    res.status(200).json({message,status:"success"});
});

module.exports={createMessage,updateMessage,deleteMessage,getChatMessages,resizeImage};