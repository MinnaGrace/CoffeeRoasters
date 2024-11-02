const {StatusCodes} = require('http-status-codes');

const errorHandlerMiddleware = (error,req,res,next)=>{
    let selectedError = {
        statusCode : error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg:error.message || 'something went wrong, try again later'
    }

    //data provided by a user or client does not meet the defined criteria or rules set for that data
    if(selectedError.name === 'ValidationError'){
        selectedError.msg = Object.values(error.errors).map((item)=>{
            return item.message
        }).join('')
        selectedError.statusCodes = 400;
    }
    //specific error code, Duplicate values
    if(error.code && error.code === 1100){
        //Object.keys() => returns an array of a given object's keys
        selectedError.msg = `Duplicate value provided for ${Object.keys(error.keyValue)}` 
        selectedError.statusCode = 400;
    }
    // Item not found
    if(error.name = "CastError"){
        //error.value, specifically used with cast errors
        selectedError.mgs = ` No item found with: ${error.value}`
    }
    return res.status(selectedError.statusCode).json({msg:selectedError.msg})
}

module.exports = errorHandlerMiddleware;