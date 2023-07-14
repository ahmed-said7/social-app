

let {check}=require('express-validator');
let User=require('../models/userModel');
let bcrypt=require('bcryptjs');
let validationResult=require('../middlewares/vlaidationExpress');

let createUserValidator=[
    check('name').notEmpty().withMessage('name is required').
    isLength({min:3,max:12}).withMessage('name length must be between 3,12'),
    check('username').notEmpty().withMessage('username is required').
    isLength({min:5,max:12}).withMessage('username length must be between 3,12'),
    check('email').notEmpty().withMessage('email is required').
    isEmail().withMessage('must be a valid email address').custom((val,{req})=>{
        User.findOne({email:val}).then((user)=>{
            if(user){
                return Promise.reject(new Error('email should be unique'));
            };
        });
        return true;
    }),
    check('password').notEmpty().withMessage('password is required').
    isLength({min:6,max:1000}).withMessage('name length must be between 6,1000').custom((val,{req})=>{
        if(val!==req.body.passwordConfirm){
            return Promise.reject(new Error('password confirm is not correct'));
        };
        return true;
    }),
    check('passwordConfirm').notEmpty().withMessage('passwordConfirm is required'),
    validationResult
];

let addFriendValidator=
[ check('id').isMongoId().withMessage('invalid format')  , validationResult ];

let removeFriendValidator=
[ check('id').isMongoId().withMessage('invalid format')  , validationResult ];

let getUserValidator=
[ check('id').isMongoId().withMessage('invalid format')  , validationResult ];

let changeLoggedUserPasswordValidator=
[ check('currentPassword').notEmpty().withMessage('currentPassword is required')
.custom((val,{req})=>{
    bcrypt.compare(val,req.user.password).then((valid)=>{
        if(!valid){
            return Promise.reject(new Error('current password is not correct'));
        };
    });
    return true;
}),
check('password').notEmpty().withMessage('password is required').
isLength({min:6,max:1000}).withMessage('name length must be between 6,1000').custom((val,{req})=>{
    if(val !== req.body.passwordConfirm){
        return Promise.reject(new Error('password confirm is not correct'));
    };
    return true;
}) ,check('passwordConfirm').notEmpty().withMessage('passwordConfirm is required') , validationResult ];

let updateLoggedUserValidator= [
    check('name').optional().
    isLength({min:3,max:12}).withMessage('name length must be between 3,12'),
    check('username').optional().
    isLength({min:5,max:12}).withMessage('username length must be between 3,12'),
    check('email').optional().
    isEmail().withMessage('must be a valid email address').custom((val,{req})=>{
        User.findOne({email:val}).then((user)=>{
            if(user){
                return Promise.reject(new Error('email should be unique'));
            };
        });
        return true;
    }),validationResult
];








module.exports={
    getUserValidator,updateLoggedUserValidator,
    removeFriendValidator,addFriendValidator,createUserValidator,
    changeLoggedUserPasswordValidator};