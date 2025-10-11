const mongoose = require('mongoose')

const connectionstring = process.env.DBCONNECTIONSTRING

mongoose.connect(connectionstring).then(res => {
    console.log("BookStore db connected succesfully");
}).catch(err => {
    console.log("MongoDB Atlas connection failed");
    console.log(err);

})