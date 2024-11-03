const Review = require('../models/reviews')
const Product = require('../models/product')
const selectedError = require('../errors')
const {StatusCodes} = require('http-status-codes')



const createReview = async(req,res)=>{
    const {product:productId} = req.body
    req.body.user = req.user.userId
    
    const validateProductId = await Product.findOne({_id:productId})
    if(!validateProductId){
        throw new selectedError.NotFoundError("not an existing product")
    }

    const duplicateReview = await Review.findOne({
        product: productId,
        user: req.user.userId
    })

    if(duplicateReview){
        throw new selectedError.BadRequestError("cannot provide duplicate review")
    }
    const review = await Review.create(req.body)
    res.status(StatusCodes.CREATED).json({review})
}
const getAllReviews= async(req,res)=>{
    res.send('get all reviews')
}
const getSingleReview= async(req,res)=>{
    res.send('get single review')
}
const updateReview = async(req,res)=>{
    res.send('update review')
}
const deleteReview = async(req,res)=>{
    res.send('delete review')
}

module.exports = {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview
}