let mongoose= require('mongoose');
let connectionToDB=(url)=>{
    mongoose.connect(url).then(()=>{
        console.log('connection to database successfully');
    }).catch((err)=>{console.log(err)});
};
module.exports=connectionToDB