let express=require('express');
const morgan = require('morgan');
let app = express();
let path = require('path');
require('dotenv').config({path:'./environ.env'});
let connectionToDB=require('./config/database')

connectionToDB(process.env.URL);
connectionToDB(process.env.URL);
let cors=require('cors');
let apiError=require('./utils/apiError');

app.use(cors('*'));
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname,'uploads')));



let userRoute=require('./routes/userRoute');
let commentRoute=require('./routes/commentRoute');
let postRoute=require('./routes/postRoute');
let messageRoute=require('./routes/messageRoute');
let chatRoute=require('./routes/chatRoute');
const globalError = require('./middlewares/globalError');



app.use('/api/v1/users',userRoute);
app.use('/api/v1/messages',messageRoute);
app.use('/api/v1/comments',commentRoute);
app.use('/api/v1/posts',postRoute);
app.use('/api/v1/chats',chatRoute);
app.all('*',(req,res,next)=>{
    return next(new apiError('not found route',400));
});
app.use(globalError);

let http = require('http');
let server=http.createServer(app);
let io=require('socket.io');
let sockets=require('./socket');
sockets(io);


server.listen(3000,()=>{
    console.log('hello Eng Ahmed Saied connetion successsfully');
})



process.on('unhandledRejection',(err)=>{
    console.log(err)
});

module.exports=app;