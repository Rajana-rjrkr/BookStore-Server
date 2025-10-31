const jobs = require('../../models/jobModel')

//add jobs
exports.addJobController = async (req, res) => {
    console.log('Inside addJobController');
    const { title, location, jobType, salary, qualification, experience, description } = req.body
    try {
        const jobDetails = await jobs.findOne({ title, location })
        if (jobDetails) {
            res.status(409).json("Job is already added, please add another one.")
        } else {
            const newJob = new jobs({
                title, location, jobType, salary, qualification, experience, description
            })
            await newJob.save()
            res.status(200).json(newJob)
        }
    } catch (err) {
        res.status(500).json(err)

    }

}
//gel all jobs
exports.getAllJobsController = async (req, res) => {
    console.log("Inside getAllJobsController");
    const searchKey = req.query.search
    const query = {
        title: { $regex: searchKey, $options: 'i' }
    }
    try {
        const allJobs = await jobs.find(query)
        res.status(200).json(allJobs)
    } catch (err) {
        res.status(500).json(err)
    }
}

//delete jobs - 6902e69341774117c3186232
exports.removeJobController=async(req,res)=>{
    console.log("Inside removeJobController");
    const {id} = req.params
    try{
       const deleteJob = await jobs.findByIdAndDelete({_id:id})
       res.status(200).json(deleteJob)
    }catch(err){
        res.status(500).json(err)
    }
}