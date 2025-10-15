const express = require('express')
const router = express.Router()
const userController = require('./controllers/userController')

//register
router.post('/register',userController.registerController)

//login
router.post('/login',userController.loginController)

module.exports = router