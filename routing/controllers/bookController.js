const books = require('../../models/bookModel')

//add book
exports.addBookController = async (req, res) => {
    console.log("Inside addBookController");
    // console.log(req.body);
    // console.log(req.files);
    const { title, author, noOfpages, imageUrl, price, discountPrice, abstract, publisher, languages, isbn, category } = req.body
    const userMail = req.payload
    var uploadImages = []
    req.files.map(item => uploadImages.push(item.filename))
    console.log(title, author, noOfpages, imageUrl, price, discountPrice, abstract, publisher, languages, isbn, category, uploadImages, userMail);
    try {
        const existingBook = await books.findOne({ title, userMail })
        if (existingBook) {
            res.status(401).json("You have already added this book")
        } else {
            const newBook = new books({
                title, author, noOfpages, imageUrl, price, discountPrice, abstract, publisher, languages, isbn, category, uploadImages, userMail
            })
            await newBook.save()
            res.status(200).json(newBook)
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

//get home books
exports.getHomeBooksController = async (req, res) => {
    console.log("Inside getHomeBooks");
    try {
        const allHomeBooks = await books.find().sort({ _id: -1 }).limit(4)
        res.status(200).json(allHomeBooks)
    } catch (err) {
        res.status(500).json(err)
    }
}

//get all books
exports.getAllBooksController = async (req, res) => {
    console.log("Inside getAllBooks");
    const email = req.payload
    try {
        const allBooks = await books.find({userMail:{$ne:email}})
        res.status(200).json(allBooks)
    } catch (err) {
        res.status(500).json(err)
    }
}

//View books
exports.viewBookController = async (req, res) => {
    console.log("Inside ViewBookController");
    const {id} = req.params
    console.log(id);
    try{
        const viewBook = await books.findById({_id:id})
        res.status(200).json(viewBook)
    }catch(err){
        res.status(500).json(err)
    }
}