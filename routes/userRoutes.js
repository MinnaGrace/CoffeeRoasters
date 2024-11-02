const {
    getAllUsers,
    getAUser,
    getCurrentUser,
    updateUser,
    updatePassword
} = require('../controllers/userController')

const {authenticateUser,authorizePermissions} = require('../middleware/authentication')

const express = require('express')
const router = express.Router();


router.route('/').get(authenticateUser,authorizePermissions('admin'),getAllUsers)
router.route('/show').get(authenticateUser,getCurrentUser)
router.route('/:id').get(authenticateUser,getAUser)


router.route('/updateUser').patch(authenticateUser,updateUser)
router.route('/updatePassword').patch(authenticateUser,updatePassword)


module.exports = router