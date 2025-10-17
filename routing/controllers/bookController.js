const books = require('../../models/bookModel')

//add book
exports.addBookController = async (req,res)=>{
    console.log("Inside addBookController");
    // console.log(req.body);
    // console.log(req.files);
    const {title,author,noOfpages,imageUrl,price,discountPrice,abstract,publisher,languages,isbn,category} = req.body
    const userMail = req.payload
    var uploadImages = []
    req.files.map(item=>uploadImages.push(item.filename))
    console.log(title,author,noOfpages,imageUrl,price,discountPrice,abstract,publisher,languages,isbn,category,uploadImages,userMail);
    try{
        const existingBook = await books.findOne({title,userMail})
            if(existingBook){
                res.status(401).json("You have already added this book")
            }else{
                const newBook = new books({
                    title,author,noOfpages,imageUrl,price,discountPrice,abstract,publisher,languages,isbn,category,uploadImages,userMail
                })
                await newBook.save()
                res.status(200).json(err)
            }
    }catch(err){
           res.status(500).json(err)
    }
}