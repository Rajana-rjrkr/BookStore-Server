const express = require('express')
const router = express.Router()
const userController = require('./controllers/userController')
const bookController = require('./controllers/bookController')
const jwtMiddleware = require('../middlewares/jwtMiddleware')
const multerConfig = require('../middlewares/imageMulterMiddleware')
const adminJwtMiddleware = require('../middlewares/adminJwtMiddleware')


//   for unauthorised User
//register
router.post('/register', userController.registerController)

//login
router.post('/login', userController.loginController)

//Googlelogin
router.post('/google-login', userController.googleLoginController)

//   for Authorised User
// -----------------------

//addBook
router.post('/add-book', jwtMiddleware, multerConfig.array('uploadImages', 3), bookController.addBookController)

//home-books
router.get('/home-books', bookController.getHomeBooksController)

//all-books
router.get('/all-books', jwtMiddleware, bookController.getAllBooksController)

//all-books
router.get('/books/:id/view', jwtMiddleware, bookController.viewBookController)

//get user books
router.get('/user-books', jwtMiddleware, bookController.getAllUserBooksController)

//get user bought books
router.get('/user-bought-books', jwtMiddleware, bookController.getAllUserBoughtBooksController)

//delete user books
router.delete('/user-books/:id/remove', jwtMiddleware, bookController.deleteUserBookController)

//user-profile update
router.put('/user-profile/edit', jwtMiddleware, multerConfig.single('profile'), userController.userProfileEditController)

//  -------------------- for Authorised User - admin  -------------------------
//to get all user
router.get('/all-user', adminJwtMiddleware, userController.getAllUsersController)

//to get all books
router.get('/admin-all-books', adminJwtMiddleware, bookController.getAllBooksAdminController)

module.exports = router