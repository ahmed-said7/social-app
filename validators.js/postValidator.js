
let {check}=require('express-validator');

let validationResult=require('../middlewares/vlaidationExpress');

let likePostValidator=
[ check('id').isMongoId().withMessage('invalid format')  , validationResult ];

let unlikePosttValidator=
[ check('id').isMongoId().withMessage('invalid format')  , validationResult ];

let SavedPostValidator=
[ check('id').isMongoId().withMessage('invalid format')  , validationResult ];

let unsavedPostValidator=
[ check('id').isMongoId().withMessage('invalid format')  , validationResult ];

let sharePostValidator=
[ check('id').isMongoId().withMessage('invalid format')  , validationResult ];

let editPosttValidator=
[ check('id').isMongoId().withMessage('invalid format')  , validationResult ];

let deletePostValidator=
[ check('id').isMongoId().withMessage('invalid format')  , validationResult ];

let getPostValidator=
[ check('id').isMongoId().withMessage('invalid format')  , validationResult ];

module.exports={likePostValidator,unlikePosttValidator,SavedPostValidator,
    unsavedPostValidator,sharePostValidator,editPosttValidator
    ,deletePostValidator,getPostValidator};