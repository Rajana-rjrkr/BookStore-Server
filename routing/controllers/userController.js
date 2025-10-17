const users = require('../../models/userModel')
const jwt = require('jsonwebtoken')

//register
exports.registerController = async (req, res) => {
    console.log("Inside Register API");
    // console.log(req.body);
    const { username, email, password } = req.body
    console.log(username, email, password);

    try {
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            res.status(409).json("User Already exist!! Please Login..")
        } else {
            const newUser = new users({
                username, email, password
            })
            await newUser.save()
            res.status(200).json(newUser)
        }
    } catch (err) {
        res.status(500).json(err)
    }

}

//login
exports.loginController = async (req, res) => {
    console.log("Inside Login API");
    // console.log(req.body);
    const { email, password } = req.body
    console.log(email, password);

    try {
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            if (existingUser.password == password) {
                //token
                const token = jwt.sign({ userMail: existingUser.email }, process.env.JWTSECRET)
                res.status(200).json({ user: existingUser, token })
            } else {
                res.status(401).json("Invalid email and Password...")
            }
        } else {
            res.status(404).json("Account does not exists...")
        }
    } catch (err) {
        res.status(500).json(err)
    }

}

//googlelogin
exports.googleLoginController = async (req, res) => {
    console.log("Inside Google Login API");
    // console.log(req.body);
    const { email, password, username, profile } = req.body
    console.log(email, password, username, profile);

    try {
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            //token
            const token = jwt.sign({ userMail: existingUser.email }, process.env.JWTSECRET)
            res.status(200).json({ user: existingUser, token })
        } else {
            const newUser = new users({
                username, email, password, profile
            })
            await newUser.save()
            //token
            const token = jwt.sign({ userMail: newUser.email }, process.env.JWTSECRET)
            res.status(200).json({ user: newUser, token })
        }
    } catch (err) {
        res.status(500).json(err)
    }

}