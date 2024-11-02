const User = require('../models/user')
const selectedError = require('../errors')
const {StatusCodes} = require('http-status-codes')
const jwt = require('jsonwebtoken')
const { attachCookiesToResponse } = require('../utils/jwt')
const {createTokenUser} = require('../utils')
const {checkPermissions} = require('../utils/checkPermissions')
const getAllUsers = async(req,res)=>{
    // removes password from users
    const users = await User.find({role:'user'}).select('-password')
    res.status(StatusCodes.OK).json({users})
}
const getAUser = async(req,res)=>{
    const user = await User.findOne({_id:req.params.id}).select('-password')
    if(!user){
        throw new selectedError.NotFoundError('no user matching id')
    }
    checkPermissions(req.user, user._id)
    res.status(StatusCodes.OK).json({user})
}
const getCurrentUser = async(req,res)=>{
    res.status(StatusCodes.OK).json({user:req.user})
}
const updateUser = async(req,res)=>{
    

    const{email, name}= req.body
    if(!email || !name){
        throw new selectedError.BadRequestError('provide user name and email')
    }
    const user = await User.findOne({ _id: req.user.userId });

    user.email = email;
    user.name = name;

    await user.save()
  
    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({res,user:tokenUser})
    res.status(StatusCodes.OK).json({user:tokenUser})
   
}
const updatePassword = async(req,res)=>{
    const{oldPassword, newPassword} = req.body
    if(!oldPassword || !newPassword){
        throw new selectedError.BadRequestError('provide new and old password')
    }
    const user = await User.findOne({_id:req.user.userId})
    const validatePassword = await user.comparePassword(oldPassword)
    if(!validatePassword){
        throw new selectedError.UnauthenticatedError('invalid credentials')
    }
    user.password = newPassword

    await user.save()
    res.status(StatusCodes.OK).json({msg:"sucessfully updated"})
   
}


module.exports = {
    getAllUsers,
    getAUser,
    getCurrentUser,
    updateUser,
    updatePassword
}