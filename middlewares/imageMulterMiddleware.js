const multer = require('multer')

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./uploads')
    },
    filename:(req,file,cb)=>{
        cb(null,`image-${Date.now()}-${file.originalname}`)
    }
})

const fileFilter = (req,file,cb)=>{
    //image with png, jpg, jpeg and svg
    if(file.mimetype=='image/png' || 'image/jpg' || 'image/jpeg' || 'image/svg' ){
        cb(null,true)
    }else{
        cb(null,false)
        return cb(new Error("Accept only png, jpg, jpeg or svg files"))
    }
}

const multerConfig = multer({
    storage,
    fileFilter
})

module.exports = multerConfig