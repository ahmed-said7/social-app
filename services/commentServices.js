let Post=require('../models/postModel');
let Comment=require('../models/commentModel');
let User=require('../models/userModel');
let handler=require('express-async-handler');
const apiError = require('../utils/apiError');

require('dotenv').config({path:'./environ.env'});

let createComment=handler(async(req,res,next)=>{
    req.body.userId=req.user._id;
    let comment=(await Comment.create(req.body));
    res.status(200).json({comment,status:'comment created'});
});

let deleteComment=handler(async(req,res,next)=>{
    let comment=await Comment.findOneAndDelete({$or:[{userPostId:req.user._id}
        ,{_id:req.params.id,userId:req.user._id}]});
    if(!comment){
        return next(new apiError('you are not allowed to delete',400))
    }
    res.status(200).json({comment,status:'comment deleted'});
});

let updateComment=handler(async(req,res,next)=>{
    let userId=req.user._id;
    let _id=req.params.id;
    let comment=await Comment.findOneAndUpdate({userId,_id},req.body,{new:true})
    .select(['media','content']);
    if(!comment){
        return next(new apiError('you are not allowed to update',400));
    };
    res.status(200).json({comment,status:'comment updated'});
});


let likeComment=handler(async(req,res,next)=>{
    let userId=req.user._id;
    let _id=req.params.id;
    let like=await Comment.findOne({_id,likes:{$all:[userId]}});
    if(like){
        return next(new apiError('you have already ladded like',400));
    };
    let comment=await Comment.findOneAndUpdate({_id},{$push:{likes:userId}},{new:true}).
    select('likes')
    .populate({path:"likes",select:"name username"})
    res.status(200).json({comment,status:'like created'});
});

let unlikeComment=handler(async(req,res,next)=>{
    let userId=req.user._id;
    let _id=req.params.id;
    let like=await Comment.findOne({_id,likes:{$all:[userId]}});
    if(!like){
        return next(new apiError('there is no like',400));
    };
    let comment=await Comment.findOneAndUpdate({_id},{$pull:{likes:userId}},{new:true}).
    select('likes')
    .populate({path:"likes",select:"name username -_id"})
    res.status(200).json({comment,status:'like removed'});
});


let getPostComments=handler(async(req,res,next)=>{
    let PostId=req.params.PostId;
    let comments=await Comment.find({PostId})
    .populate([{path:'userId'},{path:'userPostId'},{path:'PostId'},{path:'replies'}]);
    if(!comments){
        return next(new apiError('comments Not Found',400));
    }
    res.status(200).json({comments,status:'success'});
});


let createReplyToComment=handler(async(req,res,next)=>{
    let _id=req.params.id;
    let reply=await Comment.create(req.body);
    await Comment.findByIdAndUpdate(_id,{$push:{replies:reply._id}},{new:true});
    res.status(200).json({reply,status:'success'});
});


module.exports={createReplyToComment,createComment,getPostComments
    ,unlikeComment,likeComment,deleteComment,updateComment};