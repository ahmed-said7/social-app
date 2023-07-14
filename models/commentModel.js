let mongoose = require('mongoose');

let commentSchema=new mongoose.Schema(
    {
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    userPostId:{type:mongoose.Schema.Types.ObjectId,ref:'User'}
    ,PostId:{type:mongoose.Schema.Types.ObjectId,ref:'Post'}
    ,content:String,
    media:[String]
    ,likes:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}]
    ,tags:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    replies:[{type:mongoose.Schema.Types.ObjectId,ref:'Comment'}],
    },
    {timestamps:true}
    );



commentSchema.post('init',function(doc){
    if(doc.media){
        let media=[];
        doc.media.forEach(function(ele){
            let url=`http://localhost:3000/comments/${ele}`
            media.push(url);
        }); 
        doc.media=media;
    };
});

commentSchema.post('save',function(doc){
    if(doc.media){
        let media=[];
        doc.media.forEach(function(ele){
            let url=`http://localhost:3000/comments/${ele}`
            media.push(url);
        }); 
        doc.media=media;
    };
});
let commentModel=mongoose.model('Comment',commentSchema);
module.exports=commentModel;