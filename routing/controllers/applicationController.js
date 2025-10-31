const applications = require('../../models/applicationModel')

//add apllications
exports.addApplicationController = async (req, res) => {
    console.log('Inside addApplicationController');
    const { fullname, email, qualification, phone, coverLetter, jobTitle, jobId } = req.body
    const resume = req.file.filename
    try {
        const applicationDetails = await applications.findOne({ email, jobId })
        if (applicationDetails) {
            res.status(409).json("You already applied for this job")
        } else {
            const newApplication = new applications({
                fullname, email, qualification, phone, coverLetter, resume, jobTitle, jobId
            })
            await newApplication.save()
            res.status(200).json(newApplication)
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

//get applications
exports.getApplicationController = async (req, res) => {
    console.log('Inside getApplicationController');
    try {
        const allApplication = await applications.find()
        res.status(200).json(allApplication)
    } catch (err) {
        res.status(500).json(err)
    }
}