const {StatusCodes} = require('http-status-codes');
const CustomAPIError = require('./CustomAPIErrors');

class UnauthorizedError extends CustomAPIError{
    constructor(message){
        super(message)
        this.statuscode = StatusCodes.FORBIDDEN;
    }
}

module.exports = UnauthorizedError;