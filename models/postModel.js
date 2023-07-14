let mongoose = require('mongoose');

let postSchema=new mongoose.Schema(
    {
    comments:[{type:mongoose.Schema.Types.ObjectId,ref:'Comments'}],
    likes:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User'}
    ,content:String,
    media:[String],
    tags:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}]
    ,share:[{user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},caption:String}]
    } 
    , {
        timestamps:true
    });

    postSchema.post('init',function(doc){
        if(doc.media){
            let media_image=[];
            doc.media.forEach(function(media){
                let url=`http://localhost:3000/posts/${media}`
                media_image.push(url);
            }); 
            doc.media=media_image;
        };
    });
    
    postSchema.post('save',function(doc){
        if(doc.media){
            let media_image=[];
            doc.media.forEach(function(media){
                let url=`http://localhost:3000/posts/${media}`
                media_image.push(url);
            }); 
            doc.media=media_image;
        };
    });

let postModel=mongoose.model('Post',postSchema);

module.exports=postModel;