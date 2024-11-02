const {StatusCodes} = require('http-status-codes');
const CustomAPIError = require('./CustomAPIErrors');

class BadRequestError extends CustomAPIError{
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.Bad_Request;
    }
}

module.exports = BadRequestError;