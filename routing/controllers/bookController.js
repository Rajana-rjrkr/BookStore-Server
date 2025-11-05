const books = require('../../models/bookModel')
const stripe = require('stripe')('sk_test_51SPbdpC5x4zXg6DqElVKlweiBv6s2WfSrqnL2NNxzbsr0jsXDqPQwtcEmxPVRpRrDICg1F0q1oSqBWaz1PBbkUhZ00xHDKStg8')
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

//update book status
exports.updateBookStatusController = async (req, res) => {
    console.log('Inside updateBookStatusController');
    const { _id, title, author, noOfpages, imageUrl, price, discountPrice, abstract, publisher, languages, isbn, category, uploadImages, userMail, bought } = req.body
    try {
        const UpdateBook = await books.findByIdAndUpdate({ _id }, { title, author, noOfpages, imageUrl, price, discountPrice, abstract, publisher, languages, isbn, category, uploadImages, status: "approved", userMail, bought }, { new: true })
        await UpdateBook.save()
        res.status(200).json(UpdateBook)
    } catch (err) {
        res.status(500).json(err)
    }
}

//make payment
exports.makeBookPaymentController = async (req,res) => {
    console.log('Inside makeBookPaymentController');
    console.log(req.body);
    
    const {_id, title, author, noOfpages, imageUrl, price, discountPrice, abstract, publisher, languages, isbn, category,uploadImages,userMail } = req.body
    const email = req.payload
    try {
        const UpdateBookDetails = await books.findByIdAndUpdate({ _id }, { title, author, noOfpages, imageUrl, price, discountPrice, abstract, publisher, languages, isbn, category, uploadImages, status: 'sold', userMail, bought: email }, { new: true })
        console.log(UpdateBookDetails);
        //stripe checkout session
        const line_items = [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: title,
                    description: `${author} | ${publisher}`,
                    images: uploadImages,
                    metadata: {
                        title, author, noOfpages, imageUrl, price, discountPrice, abstract, publisher, languages, isbn, category, status: 'sold', userMail, bought: email
                    }
                },
                unit_amount: Math.round(discountPrice * 100)
            },
            quantity: 1
        }]

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: 'payment',
            success_url: "http://localhost:3000/payment-success",
            cancel_url: "http://localhost:3000/payment-error"
        });
        console.log(session);
        res.status(200).json({ checkoutSessionURL: session.url })

    } catch (err) {
        res.status(500).json(err)
    }
}
