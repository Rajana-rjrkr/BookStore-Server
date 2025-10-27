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
    const searchKey = req.query.search
    const email = req.payload
    const query = {
        title: { $regex: searchKey, $options: 'i' },
        userMail: { $ne: email }
    }
    try {
        const allBooks = await books.find(query)
        res.status(200).json(allBooks)
    } catch (err) {
        res.status(500).json(err)
    }
}

//View books
exports.viewBookController = async (req, res) => {
    console.log("Inside ViewBookController");
    const { id } = req.params
    console.log(id);
    try {
        const viewBook = await books.findById({ _id: id })
        res.status(200).json(viewBook)
    } catch (err) {
        res.status(500).json(err)
    }
}

//get all user books
exports.getAllUserBooksController = async (req, res) => {
    console.log("Inside getAllUserBooksController");
    const email = req.payload
    try {
        const allUserBooks = await books.find({ userMail: email })
        res.status(200).json(allUserBooks)
    } catch (err) {
        res.status(500).json(err)
    }
}

//get all user bought books
exports.getAllUserBoughtBooksController = async (req, res) => {
    console.log("Inside getAllUserBoughtBooksController");
    const email = req.payload
    try {
        const allUserBoughtBooks = await books.find({ bought: email })
        res.status(200).json(allUserBoughtBooks)
    } catch (err) {
        res.status(500).json(err)
    }
}

//removing user uploaded books
exports.deleteUserBookController = async (req, res) => {
    console.log("Inside deleteUserBookController");
    //get book id
    const { id } = req.params
    console.log(id);
    try {
        await books.findByIdAndDelete({ _id: id })
        res.status(200).json("Book Deleted Successfully...")
    } catch (err) {
        res.status(500).json(err)
    }
}

//get all books to admin
exports.getAllBooksAdminController = async (req, res) => {
    console.log('Inside getAllBooksAdminController');
    try {
        const allAdminBooks = await books.find()
        res.status(200).json(allAdminBooks)
    } catch (err) {
        res.status(500).json(err)
    }
}