let router=require('express').Router({mergeParams:true});

let {protected,signup,login,allowedTo}=require('../services/authServices');
let {createChat,getChats,getChat,deleteChat,removeMemberFromChat,addMemberToChat}=require('../services/chatServices');
let messageRouter=require('../models/messageModel');
let {createChatValidator,getChatValidator,deleteChatValidator,
    updateChatValidator}=require('../validators.js/chatValidator');
router.use('/:chatId/messages', messageRouter);
router.use(protected,allowedTo('admin',"user"));
router.route('/').post(createChatValidator,createChat).get(getChats);
router.route('/:id').get(getChatValidator,getChat)
    .delete(deleteChatValidator,deleteChat);

router.route('/add').put(updateChatValidator,addMemberToChat);

router.route('/remove').put(updateChatValidator,removeMemberFromChat);



module.exports =router;