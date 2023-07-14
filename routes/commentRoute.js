let router=require('express').Router({mergeParams:true});
let {createReplyToComment,createComment,getPostComments
    ,unlikeComment,likeComment,deleteComment,updateComment}=require('../services/commentServices')
let {protected,signup,login,allowedTo}=require('../services/authServices');

let {uploadSingleImage,uploadMultipleImage,resizeImage}=require('../middlewares/uploadImage');

let {createCommentValidator,createReplyToCommentValidator
    ,likeCommentValidator,unlikeCommentValidator,updateCommentValidator,deleteCommentValidator}=
    require('../validators.js/commentValidator')

router.use(protected);

router.route('/').get(allowedTo('user','admin'),getPostComments).
        post(allowedTo('user','admin'),uploadMultipleImage([{name:"media",maxCount:5}]),
        resizeImage('comments'),createCommentValidator,createComment);

router.route('/:id').put(allowedTo('user','admin'),uploadMultipleImage([{name:"media",maxCount:5}]),
        resizeImage('comments'),updateCommentValidator,updateComment);

router.route('/like/:id').put(allowedTo('user','admin'),likeCommentValidator,likeComment);

router.route('/unlike/:id').put(allowedTo('user','admin'),unlikeCommentValidator,unlikeComment);

router.route('/:id').delete(allowedTo('user','admin'),deleteCommentValidator,deleteComment);

router.route('/:id').post(allowedTo('user','admin'),createReplyToCommentValidator,createReplyToComment);




module.exports =router;