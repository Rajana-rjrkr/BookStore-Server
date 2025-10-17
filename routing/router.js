const express = require('express')
const router = express.Router()
const userController = require('./controllers/userController')
const bookController = require('./controllers/bookController')
const jwtMiddleware = require('../middlewares/jwtMiddleware')
const multerConfig = require('../middlewares/imageMulterMiddleware')

//register
router.post('/register',userController.registerController)

//login
router.post('/login',userController.loginController)

//Googlelogin
router.post('/google-login',userController.googleLoginController)

//addBook
router.post('/add-book',jwtMiddleware,multerConfig.array('uploadImages',3),bookController.addBookController)


module.exports = router