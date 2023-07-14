
let {check}=require('express-validator');

let validationResult=require('../middlewares/vlaidationExpress');

let createMessageValidator=[
    check('chatId').notEmpty().withMessage('chatId is required'),
    validationResult
]

let getChatMessagesValidator=
[ check('chatId').isMongoId().withMessage('invalid format')  , validationResult ];


let updateMessageValidator=
[ check('id').isMongoId().withMessage('invalid format')  , validationResult ];

let deleteMessageValidator=
[ check('id').isMongoId().withMessage('invalid format')  , validationResult ];




module.exports={getChatMessagesValidator,updateMessageValidator,
    deleteMessageValidator,
    createMessageValidator};