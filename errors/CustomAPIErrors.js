class CustomAPIError extends Error{
    constructor(message){
        // takes message and send to the parent (Error class)
        super(message)
    }

}

module.exports = CustomAPIError;