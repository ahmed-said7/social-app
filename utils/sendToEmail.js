let nodemailer=require('nodemailer');
require('dotenv').config({path:'./environ.env'});


let transport=nodemailer.createTransport({
    service:'gmail',secure:false,port:587,host:"smtp.gmail.com",
    auth:{user:process.env.EMAIL,pass:process.env.PASS}
});
module.exports=transport;