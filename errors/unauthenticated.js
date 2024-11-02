const {StatusCodes} = require('http-status-codes');
const CustomAPIError = require('./CustomAPIErrors');

class UnauthenticatedError extends CustomAPIError{
    constructor(message){
        super(message)
        this.statuscode = StatusCodes.UNAUTHORIZED;
    }
}

module.exports = UnauthenticatedError