
const {StatusCodes} = require('http-status-codes');
const CustomAPIError = require('./CustomAPIErrors');
class NotFoundError extends CustomAPIError {
    constructor(message){
        super(message)
        this.statuscode = StatusCodes.NOT_FOUND;
    }
}

module.exports = NotFoundError;