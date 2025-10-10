//import dotenv cors express
//loads .env file contents into process.env
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router = require('./routing/router')

//create server
const bookstoreServer = express()

//enable cors protocol in server app
bookstoreServer.use(cors())
bookstoreServer.use(express.json()) //parse json
bookstoreServer.use(router) //give after cors
//create port for app
const PORT = 3000

//run server PORT
bookstoreServer.listen(PORT,()=>{
    console.log(`BookStore Server started successfully at PORT : ${PORT}, and waiting for client request!!`);
    
})

//resolving http request
bookstoreServer.get('/',(req,res)=>{
    res.status(200).send(`<h1 style="color:green;">BookStore Server started successfully at PORT..and waiting for client request!!</h1>`)
})

