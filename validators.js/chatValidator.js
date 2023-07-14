
let {check}=require('express-validator');

let validationResult=require('../middlewares/vlaidationExpress');
const apiError = require('../utils/apiError');

let createChatValidator=[
    check('members').notEmpty().withMessage('Please enter members ids')
    .isArray().withMessage('Please enter members Ids in array').
    custom((val,{req})=>{
        val.push(req.user._id);
        return true;
    }).custom((val,{req})=>{
        User.findOne({_id:{$in:val}}).then((users)=>{
            if(users.length!==val.length){
                return next(new apiError('Users ids not found','400'))
            };
        })
        return true;
    }) , validationResult ];

let getChatValidator=
    [ check('id').isMongoId().withMessage('Please enter chat id')  , validationResult ];
let deleteChatValidator=
    [ check('id').isMongoId().withMessage('Please enter chat id')  , validationResult ];

let updateChatValidator=
[ check('id').isMongoId().withMessage('Please enter chat id')  , validationResult ];
module.exports={createChatValidator,getChatValidator,deleteChatValidator,updateChatValidator};