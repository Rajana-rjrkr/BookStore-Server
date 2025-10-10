const express = require('express')
const router = express.Router()
const userController = require('./controllers/userController')

//register
router.post('/register',userController.registerController)

module.exports = router