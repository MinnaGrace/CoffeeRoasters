const selectedError = require('../errors')
const {verifyToken} = require('../utils')

//checks that user has valid token 
const authenticateUser = async(req,res,next)=>{
    const token =req.signedCookies.token
    // checks if token is present
    if(!token){
        throw new selectedError.UnauthenticatedError('invalid authentication')
    }
    //checks if token is valid
    try{

        const {name, userId, role}= verifyToken({token})
        req.user = {name, userId,role}
        next()

    }
    catch(error){
        throw new selectedError.UnauthenticatedError('invalid authentication')
    }

}
//checks that user is admin before allowing get all user route
const authorizePermissions = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            throw new selectedError.unauthorized('unauthorized')
        }
        next()
    }
}

module.exports = {
    authenticateUser,
    authorizePermissions
}