
let router=require('express').Router();

let {protected,signup,login,allowedTo,forgetPassword,vertifyResetCode,changePassword}=require('../services/authServices');

let {
    removeFriend,addFriend,
    createUser,
    getUsers,getUser,
    logoutLoggedUser,
    getLoggedUser,deleteLoggedUser,
    updateLoggedUser,
    updateLoggedUserPassword
    }
    =require('../services/userServices')


let {
    getUserValidator,updateLoggedUserValidator,
    removeFriendValidator,addFriendValidator,createUserValidator,
    changeLoggedUserPasswordValidator}=require('../validators.js/userValidator');
let {uploadSingleImage,uploadMultipleImage,resizeImage,userResizeImage}
    =require('../middlewares/uploadImage.js')
router.route('/login').post(login);

router.route('/signup').post(uploadMultipleImage([{name:"coverImages",maxCount:3}
    ,{name:"profileImage",maxCount:1}]),userResizeImage,createUserValidator,signup);

router.use(protected)

router.route('/logout').post(allowedTo('user','admin'),logoutLoggedUser);

router.route('/forget-password').post(forgetPassword);
router.route('/reset-code').post(vertifyResetCode);
router.route('/change-password').post(changePassword);

router.route('/').get(allowedTo("user","admin"),getUsers);

router.route('/').post(allowedTo('admin'),
    uploadMultipleImage([{name:"coverImages",maxCount:3},{name:"profileImage",maxCount:1}]),
    userResizeImage,createUserValidator,createUser);

router.route('/add-friend/:id').post(allowedTo('user','admin'),addFriendValidator,addFriend);

router.route('/remove-friend/:id').post(allowedTo('user','admin'),removeFriendValidator,removeFriend);

router.route('/edit-profile').post(allowedTo('user','admin'),
    uploadMultipleImage([{name:"coverImages",maxCount:3},{name:"profileImage",maxCount:1}]),
    userResizeImage,
    updateLoggedUserValidator,updateLoggedUser);

router.route('/update-password').post(allowedTo('user','admin'),
    changeLoggedUserPasswordValidator,updateLoggedUserPassword);

router.route('/getme').get(allowedTo('user','admin'),getLoggedUser);

router.route('/deleteme').post(allowedTo('user','admin'),deleteLoggedUser);

router.route('/:id').get(allowedTo('user','admin'),getUserValidator,getUser);

module.exports =router;