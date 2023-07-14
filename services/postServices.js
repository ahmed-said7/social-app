
let Post=require('../models/postModel');
let User=require('../models/userModel');
let handler=require('express-async-handler');
const apiError = require('../utils/apiError');;
require('dotenv').config({path:'./environ.env'});


let createPost=handler(async(req,res,next)=>{
    req.body.user=req.user._id; 
    let post=await Post.create(req.body);
    res.status(200).json({status: 'success',post});
});

let getPosts=handler(async(req,res,next)=>{
    let posts=await Post.find({user:{$in:[...req.user.following,req.user._id]}})
    .populate(['likes','comments','user']);
    res.status(200).json({status: 'success',posts});
});

let deletePost=handler(async(req,res,next)=>{
    let post=await Post.findOneAndDelete({user:req.user._id,_id:req.params.id});
    if(!post){
        return next(new apiError('not allowed',400));
    };
    res.status(200).json({status: 'deleted'});
});

let getPost=handler(async(req,res,next)=>{
    let post=await Post.find({_id:req.params.id}).
        populate(['likes','comments','user']);
    res.status(200).json({status: 'success',post});
});

let likePost=handler(async(req,res,next)=>{
    let like=await Post.findOne({ likes : { $all:[req.user._id.toString()] } , _id:req.params.id });
    if(like){
        return next(new apiError('you have already added like',400));
    };
    let post=await Post.findOneAndUpdate({_id:req.params.id},{$push:{likes:req.user._id}},{new:true})
    .select('likes').populate('likes');
    res.status(200).json({status: 'success', post});
});

let unlikePost=handler(async(req,res,next)=>{
    let unlike=await Post.find({likes:{$all:[req.user._id.toString()]},_id:req.params.id})
    .select('likes').populate('likes');
    if(!unlike){
        return next(new apiError('you are not allowed',400));
    };
    let post=await Post.findByIdAndUpdate(req,params.id,{$pull:{likes:req.user._id}},{new:true})
    res.status(200).json({status: 'success',post});
});



let editPost=handler(async(req,res,next)=>{
    let post=await Post.findByIdAndUpdate(req.params.id,req.body,{new:true}).select('content media');
    if(!post){
        return next(new apiError('no post found',400));
    };
    res.status(200).json({status: 'success',post});
});

let savedPost=handler(async(req,res,next)=>{
    let post=await Post.findOne({_id:req.params.id});
    if(!post){
        return next(new apiError('no post found',400));
    };
    let user=await User.findOne({savedPosts:{$all:req.params.id}});
    if(user){
        return next(new apiError('you have already saved post',400));
    }
    user=await User.findByIdAndUpdate(req.user._id,
        {$push:{savedPosts:req.params.id}},{new:true}).select('savedPosts').populate('savedPosts')
    res.status(200).json({status: 'success',user});
});

let unsavedPost=handler(async(req,res,next)=>{
    let post=await Post.findOne({_id:req.params.id});
    if(!post){
        return next(new apiError('no post found',400));
    };
    let user=await User.findOne({savedPosts:{$all:req.params.id}});
    if(!user){
        return next(new apiError('no saved post found for id',400));
    }
    user=await User.findByIdAndUpdate(req.user._id,
        {$pull:{savedPosts:req.params.id}},{new:true}).select('savedPosts').populate('savedPosts');
    res.status(200).json({status: 'success',user});
});

module.exports={unlikePost,likePost,getPosts,getPost,deletePost,createPost,editPost
    ,savedPost,unsavedPost};