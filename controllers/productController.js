const Product = require('../models/product')
const selectedError = require('../errors')
const {StatusCodes} = require('http-status-codes')
const path = require('path');

const createProduct = async(req,res)=>{
    req.body.user =req.user.userId
    const product = await Product.create(req.body)
    res.status(StatusCodes.CREATED).json({product})
}   
const getAllProducts = async(req,res)=>{
   const products = await Product.find({})
   res.status(StatusCodes.OK).json({products})
}
const getSingleProduct = async(req,res)=>{
    const{id:productId} =  req.params
    const product = await Product.find({_id: productId})
    res.status(StatusCodes.OK).json({product})
}
const updateProduct = async(req,res)=>{
    const{id:productId} = req.params;
    const product = await Product.findOneAndUpdate({_id:productId},req.body,{
        new:true,
        runValidators:true
    })
    if(!product){
     throw new selectedError.NotFoundError("product not found")
    }

    res.status(StatusCodes.OK).json(product)
}
const deleteProduct = async(req,res)=>{
    const{id:productId} = req.params;
    const product = await Product.findOne({_id:productId})
    if(!product){
        throw new selectedError.NotFoundError("product not found")
    }
    await product.remove()
    res.staus(StatusCodes.OK).json({msg:"product removed"})
}
const uploadImage = async(req,res)=>{
    if (!req.files) {
        throw new selectedError.BadRequestError('No File Uploaded');
      }
      const productImage = req.files.image;
    
      if (!productImage.mimetype.startsWith('image')) {
        throw new selectedError.BadRequestError('Please Upload Image');
      }
    
      const maxSize = 1024 * 1024;
    
      if (productImage.size > maxSize) {
        throw new selectedError.BadRequestError(
          'Please upload image smaller than 1MB'
        );
      }
    
      const imagePath = path.join(
        __dirname,
        '../public/uploads/' + `${productImage.name}`
      );
      await productImage.mv(imagePath);
      res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
}
// public/uploads/au-shield-2.svg


module.exports ={
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage
}