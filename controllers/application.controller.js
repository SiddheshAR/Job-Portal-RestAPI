import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";


export const applyJob = async (req,res)=>{
    try{
        const userId = req.id;
        if(!userId){
            return res.status(400).json({
                message:"Please Sign in",
                success:false
            })
        }
        const jobId = req.params.id;
        if(!jobId){
            return res.status(400).json({
                message:"Job Id not received.",
                success:false
            })
        }; 
        const exisitingApplicant = await Application.findOne({job:jobId,applicant:userId});
        if(exisitingApplicant){
            return res.status(400).json({
                message:"You have already applied for the job",
                success:false
            })
        }
        const job = await Job.findById(jobId);
        if(!job){
            return res.status(400).json({
                message:"Job not Found",
                success:false
            })
        }
        const newApplication = await Application.create({
            job:jobId,
            applicant:userId
        });
        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            message:"Applied Succesfully",
            success:true
        })
    }catch(error){
        return res.status(400).json({
            message:"Something went wrong.",
            success:false
        })
    }
}

export const getAppliedJobs =async(req,res)=>{
    try{
        const userId= req.id;
        const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:'job',
            options:{
                sort:{createdAt:-1}
            },
            populate:{
                path:'company',
                options:{sort:{createdAt:-1}}
            }
        });
        if(!application){
            return res.status(404).json({
                message:"No Applications Found",
                success:false
            })
        };
        return res.status(200).json({
            application,
            success:true
        })
    }catch(error){
        return res.status(400).json({
            message:"Something went wrong",
            success:false
        })
    }
}
// For Admin,to see his results.
export const getApplicants = async(req,res)=>{
    try{
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:'applications',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'applicant'
            }
        });
        if(!job){
            return res.status(404).json({
                message:"Something went wrong",
                success:false
            })
        }
        return res.status(200).json({
            job,
            success:true,
        })
    }catch(error){
        return res.status(400).json({
            message:"Something went wrong",
            success:false
        })
    }
}

export const UpdateStatus  = async (req,res)=>{
    try{
        const {status}= req.body;
        const applicationId = req.params.id;
        if(!status){
            return res.status(400).json({
                message:"Status is required",
                success:false
            })
        };
        const application = await Application.findOne({_id:applicationId})
        if(!application){
            return res.status(404).json({
                message:"Application not found",
                success:false
            })
        }
        application.status = status.toLowerCase();
        await application.save();
        return res.status(200).json({
            message:"Status updated successfully.",
            success:true
        });
        
    }catch(error){
        return res.status(400).json({
            message:"Something went wrong",
            success:false
        })
    }
}
