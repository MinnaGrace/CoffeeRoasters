const express = require('express')
const router = express.Router()
const { authorizePermissions, authenticateUser} = require("../middleware/authentication");
const{
    createOrder,
    getAllOrders,
    getCurrentUserOrder,
    getSingleOrder,
    updateOrder
} = require('../controllers/orderController')

router.route('/').post(authenticateUser,createOrder)
.get(authenticateUser,authorizePermissions('admin'),getAllOrders)

router.route("/showMyOrders").get(authenticateUser, getCurrentUserOrder);

router.route('/:id').get(authenticateUser,getSingleOrder)
.patch(authenticateUser, updateOrder)



module.exports = router;