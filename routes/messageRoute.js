let router=require('express').Router({mergeParams: true});

let {protected,signup,login,allowedTo}=require('../services/authServices');
let {createMessage,updateMessage,deleteMessage,getChatMessages}=require('../services/messageServices');
let {uploadSingleImage,uploadMultipleImage,resizeImage}=require('../middlewares/uploadImage');
let {getChatMessagesValidator,updateMessageValidator,
    deleteMessageValidator,
    createMessageValidator}=require('../validators.js/messageValidator')
router.use(protected,allowedTo('admin',"user"));

router.route('/').post(uploadMultipleImage([{name:"media",maxCount:5}]),resizeImage('messages'),createMessageValidator,createMessage)
.get(getChatMessagesValidator,getChatMessages);

router.route('/:id').put(uploadMultipleImage([{name:"media",maxCount:5}]),resizeImage('messages'),
    updateMessageValidator,updateMessage).
    delete(deleteMessageValidator,deleteMessage);





module.exports =router;