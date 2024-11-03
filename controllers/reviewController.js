const Review = require('../models/reviews')
const Product = require('../models/product')
const selectedError = require('../errors')
const {StatusCodes} = require('http-status-codes')
const { checkPermissions } = require('../utils')



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
    const reviews = await Review.find({}).populate({
        path:'product',
        select:'name'
    }).populate({
        path:'user',
        select:'name'
    })
    res.status(StatusCodes.OK).json({reviews, count:reviews.length})
}
const getSingleReview= async(req,res)=>{
    const{id:reviewId} =req.params
    const review = await Review.findOne({_id: reviewId})
    if(!review){
        throw new selectedError.NotFoundError("review not found")
    }
    res.status(StatusCodes.OK).json({review})
}
const updateReview = async(req,res)=>{
    const {id:reviewId} = req.params
    const review = await Review.findOneAndUpdate({_id:reviewId})
    const{rating,title,comment} =req.body
    review.rating = rating
    review.title = title
    review.comment= comment

    await review.save()

    res.status(StatusCodes.OK).json({review})
}

const deleteReview = async (req, res) => {
    const { id: reviewId } = req.params;
  
    const review = await Review.findOne({ _id: reviewId });
  
    if (!review) {
      throw new selectedError.NotFoundError(`No review with id ${reviewId}`);
    }
  
    checkPermissions(req.user, review.user);

    await review.deleteOne();
    res.status(StatusCodes.OK).json({ msg: 'Success! Review removed' });
  };


const singleProductReviews = async (req,res)=>{
    const{id:productId} = req.params
    const reviews = await Review.find({product: productId})

    res.status(StatusCodes.OK).json({reviews})
    
}

module.exports = {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview,
    singleProductReviews
}