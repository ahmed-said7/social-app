let multer=require('multer');
const apiError = require('../utils/apiError');
let handler=require('express-async-handler');
let uuid=require('uuid');
let sharp=require('sharp');

let uploadImage=function(){
    let multerStorage=multer.memoryStorage();
    let filter=function(req,file,cb){
        // "".startsWith
        console.log(file);
        if(file.mimetype.startsWith('image')){
            cb(null,true);
        }else{
            cb(new apiError('allowed images only',400),false);
        };
    };
    return multer({storage:multerStorage,fileFilter:filter});
};

let uploadSingleImage=(field)=> uploadImage().single(field);
let uploadMultipleImage=(field)=> uploadImage().fields(field);


let resizeImage= (modelName) => handler(async(req,res,next)=>{
    // console.log(req.files);
    if(req.files){
        if(req.files.media){
            req.body.media=[];
            let images=req.files.media.map((ele)=>{
                let filename=`${modelName}-${uuid.v4()}-${Date.now()}.jpeg`;
                req.body.media.push(filename);
                sharp(ele.buffer).resize(600,600).toFormat('jpeg').
                jpeg({quality:90}).toFile(`uploads/${modelName}/${filename}`)
            });
            await Promise.all(images);
        };
    };
    next();
});

let userResizeImage=handler(async(req,res,next)=>{
    if(req.files){
        if(req.files.coverImages){
            req.body.coverImages=[];
            let images=req.files.coverImages.map((ele)=>{
                let filename=`users-${uuid.v4()}-${Date.now()}.jpeg`;
                req.body.coverImages.push(filename);
                sharp(ele.buffer).resize(600,600).toFormat('jpeg').
                jpeg({quality:90}).toFile(`uploads/users/${filename}`)
            });
            await Promise.all(images);
        };
        if(req.files.profileImage){
            let filename=`users-${uuid.v4()}-${Date.now()}.jpeg`;
            req.body.profileImage=filename;
            await sharp(req.files.profileImage[0].buffer)
                .resize(600,600).toFormat('jpeg').
                jpeg({quality:90}).toFile(`uploads/users/${filename}`)
        };
    };
    next();
})

module.exports = {uploadSingleImage,uploadMultipleImage,resizeImage,userResizeImage};