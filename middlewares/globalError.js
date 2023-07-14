let globalError=(err,req,res,next)=>{
    console.log(err);
    let statusCode=err.statusCode || 400;
    res.status(statusCode).json({message:err.message,status:err.status,error:err});
};
module.exports = globalError;