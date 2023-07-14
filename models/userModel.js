let mongoose=require('mongoose');
let bcryptjs=require('bcryptjs');
let userSchema=new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
    },
    username:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowecase:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
    },
    password:{
        type:String,
        minlength:6,
        maxlength:1000,
    },
    role:{
        type:String,
        enum:['user', 'admin'],
        default:'user',
    },
    savedPosts:[{type:mongoose.Schema.Types.ObjectId,ref:'Post'}],
    followers:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    following:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    passwordChangedAt:Date,
    passwordResetCode:String,
    passwordResetCodeExpiredAt:Date,
    passwordVertifyResetCode:Boolean,
    bio:String,
    profileImage:String,
    coverImages:[String],
    work:String,
    gender:String,
    birthday:String,
    hobbies:[String],
    education:{
        university:String,
        college:String,
        secondarySchool:String,
    },
    links:[{url:String,service:String}],
    address:{town:String,country:String,street:String,},
    Logout:{type:Boolean,default:false},
    },
    {
        timestamps:true
    });

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next();
    };
    this.password=await bcryptjs.hash(this.password,12);
    next();
});

// userSchema.pre(/^find/,async function(next){
//     await this.select('-Logout');
//     next();
// });

let profileImage_url=(doc)=>{
    if(doc.profileImage){
        let url=`http://localhost:3000/posts/${doc.profileImage}`;
        doc.profileImage=url;
    };
};

userSchema.post('init',function(doc){
    if(doc.coverImages){
        let media_image=[];
        doc.coverImages.forEach(function(media){
            let url=`http://localhost:3000/posts/${media}`
            media_image.push(url);
        }); 
        doc.coverImages=media_image;
    };
    profileImage_url(doc);
});

userSchema.post('save',function(doc){
    if(doc.coverImages){
        let media_image=[];
        doc.coverImages.forEach(function(media){
            let url=`http://localhost:3000/users/${media}`
            media_image.push(url);
        }); 
        doc.coverImages=media_image;
    };
    profileImage_url(doc);
});

let userModel=mongoose.model('User',userSchema);
module.exports=userModel;