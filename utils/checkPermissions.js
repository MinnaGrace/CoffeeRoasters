const selectedError = require('../errors')

const checkPermissions = (requestUser, resourceUserId)=>{
    if(requestUser.role === 'admin'){
        return
    }
    if(requestUser.resourceUserId === resourceUserId.toString())return

    else{
        throw new selectedError.unauthorized("not authorized to access this route")
    }
}


module.exports = {checkPermissions};