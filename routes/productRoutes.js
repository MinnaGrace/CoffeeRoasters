const {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage
} = require('../controllers/productController');

const{singleProductReviews} = require('../controllers/reviewController')
const express = require('express');
const { authenticateUser, authorizePermissions } = require('../middleware/authentication');
const router = express.Router()


router
.route('/')
.get(getAllProducts)

router.route('/uploadImage').post([authenticateUser, authorizePermissions('admin')],uploadImage)

router.route('/createProduct').post([authenticateUser, authorizePermissions('admin')], createProduct)

router
.route('/:id')
.patch([authenticateUser, authorizePermissions('admin')], updateProduct)
.delete([authenticateUser, authorizePermissions('admin')], deleteProduct)
.get(getSingleProduct)


router.route('/:id/reviews').get(singleProductReviews)



module.exports = router;