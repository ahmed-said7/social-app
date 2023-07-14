let router=require('express').Router();

let commentRouter=require('../routes/commentRoute')

let {protected,allowedTo}=require('../services/authServices');

let {sharePost,unlikePost,likePost,getPosts,getPost,deletePost,createPost,editPost,savedPost,unsavedPost}
    =require('../services/postServices');


let {likePostValidator,unlikePosttValidator,SavedPostValidator,
        unsavedPostValidator,sharePostValidator,editPosttValidator
        ,deletePostValidator,getPostValidator}=require('../validators.js/postValidator');

let {uploadSingleImage,uploadMultipleImage,resizeImage}=require('../middlewares/uploadImage');

router.use('/:PostId/comments',commentRouter);
router.use(protected);

router.route('/').get(allowedTo('user','admin'),getPosts).post(allowedTo('user','admin'),
    uploadMultipleImage([{name:"media",maxCount:5}]),resizeImage('posts'),createPost);;

router.route('/:id').get(allowedTo('user','admin'),getPostValidator,getPost);

router.route('/like/:id').put(allowedTo('user','admin'),likePostValidator,likePost);

router.route('/unlike/:id').put(allowedTo('user','admin'),unlikePosttValidator,unlikePost);

router.route('/:id').delete(allowedTo('user','admin'),deletePostValidator,deletePost);

// router.route('/share/:id').post(allowedTo('user','admin'),sharePostValidator,sharePost);

router.route('/:id').put(allowedTo('user','admin'),uploadMultipleImage([{name:"media",maxCount:5}]),resizeImage('posts')
    ,editPosttValidator,editPost);

router.route('/save/:id').put(allowedTo('user','admin'),SavedPostValidator,savedPost);

router.route('/unsave/:id').put(allowedTo('user','admin'),unsavedPostValidator,unsavedPost);




module.exports =router;