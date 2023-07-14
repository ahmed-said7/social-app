let mongoose = require('mongoose');

let messageSchema=new mongoose.Schema({
    recipient:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    sender:{type:mongoose.Schema.Types.ObjectId,ref:'User'}
    ,content:String,
    media:[String],
    chatId:{type:mongoose.Schema.Types.ObjectId,ref:'Chat'}
    }
,   { 
    timestamps:true
    });

messageSchema.post('init',function(doc){
    if(doc.media){
        let media=[];
        doc.media.forEach(function(ele){
            let url=`http://localhost:3000/messages/${ele}`
            media.push(url);
        }); 
        doc.media=media;
    };
});

messageSchema.post('save',function(doc){
    if(doc.media){
        let media=[];
        doc.media.forEach(function(ele){
            let url=`http://localhost:3000/messages/${ele}`
            media.push(url);
        }); 
        doc.media=media;
    };
});
let messageModel=mongoose.model('Message',messageSchema);

module.exports=messageModel;