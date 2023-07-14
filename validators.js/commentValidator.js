
let {check}=require('express-validator');

let validationResult=require('../middlewares/vlaidationExpress');

let createCommentValidator=[ check('userPostId').notEmpty().withMessage('chatId is required')
    .isMongoId().withMessage('invalid format'),check('PostId').notEmpty().withMessage('chatId is required')
    .isMongoId().withMessage('invalid format'), validationResult ];

let createReplyToCommentValidator=[ check('userPostId').notEmpty().withMessage('chatId is required')
.isMongoId().withMessage('invalid format'),check('postId').notEmpty().withMessage('chatId is required')
.isMongoId().withMessage('invalid format'),
check('id').isMongoId().withMessage('invalid format')
,validationResult ];

let likeCommentValidator=
[ check('id').isMongoId().withMessage('invalid format')  , validationResult ];

let unlikeCommentValidator=
[ check('id').isMongoId().withMessage('invalid format')  , validationResult ];

let updateCommentValidator=
[ check('id').isMongoId().withMessage('invalid format')  , validationResult ];

let deleteCommentValidator=
[ check('id').isMongoId().withMessage('invalid format')  , validationResult ];

module.exports ={createCommentValidator,createReplyToCommentValidator
    ,likeCommentValidator,unlikeCommentValidator,updateCommentValidator,deleteCommentValidator};