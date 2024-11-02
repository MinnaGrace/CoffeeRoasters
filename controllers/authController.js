
const User = require('../models/user')
const selectedError = require('../errors')
const {StatusCodes} = require('http-status-codes')
const jwt = require('jsonwebtoken')
const { attachCookiesToResponse} = require('../utils/jwt')
const{createTokenUser}=require('../utils')

const register = async(req,res)=>{
    // ensure a unique email
    const{email,name,password} = req.body
    const notUniqueEmail = await User.findOne({email})
    if(notUniqueEmail){
        throw new selectedError.BadRequestError('email already exists')
    }
    if(!email|| !name || !password){
        throw new selectedError.BadRequestError('please provide name, email, and password')
    }
    //first registered user as an admin
    const firstAccount = await User.countDocuments({}) === 0
    const role = firstAccount ? 'admin':'user'

    const user = await User.create({ name, email,password,role})
    
    // provide token once user is registered
    const tokenUser = createTokenUser({user})
    
    attachCookiesToResponse({res, user:tokenUser})

    res.status(StatusCodes.CREATED).json({user:tokenUser})
    
}

const login = async(req,res)=>{
    const {email,password}=req.body;

    if(!email || !password){
         throw new selectedError.BadRequestError('Please provide email and password')
    }
    const user = await User.findOne({email})

    if(!user){
        throw new selectedError.UnauthenticatedError('invalid credentials')
    }
    
    const passwordMatch = await user.comparePassword(password)

    if(!passwordMatch){
        throw new selectedError.UnauthenticatedError('invalid credentials')
    }
    const tokenUser = createTokenUser({user})

    attachCookiesToResponse({res, user:tokenUser})
    
    
    res.status(StatusCodes.CREATED).json({user:tokenUser})
}
 
const logout = async(req,res)=>{
    // when logging a user out we want to remove the token
    res.cookie('token','logout', {
        httpOnly:true,
        expires: new Date(Date.now()+5*1000),
    })

    res.status(StatusCodes.OK).json({msg:'user logged out'})
}

module.exports = {
    register,
    login,
    logout,
}