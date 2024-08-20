import {Job} from "../models/job.model.js";

export const postJob = async(req,res)=>{
    try{
        const {title, description, requirements, salary, location, jobType, experience, position, companyId} = req.body;
        const userId = req.id;
        // console.log("Debugger 1")
        if(!userId){
            return(res.status(400).json({
                message:"Invalid Credentials.",
                success:false
            }))
        }
        // console.log("Debugger 2")

        if(!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId){
            return(res.status(400).json({
                message:"Please fill all Fields.",
                success:false
            }))
        };
        // console.log("Debugger 3")
        try{
            const jobCreate = await Job.create({
                title,
                description,
                requirements:requirements.split(','),
                salary:Number(salary),
                location,
                jobType,
                experienceLevel:Number(experience),
                position:Number(position),
                company:companyId,
                created_by:userId
            });
            console.log(jobCreate);
        }catch(error){
            return res.status(400).json({   
                message:"Failed to add Data.Please check all fields properly.",
                success:true
            })
        }
        return res.status(200).json({   
            message:"Data added succesfully",
            success:true
        })
        // console.log("Debugger 4")

    }catch(error){
        return res.status(400).json({
            message:"Something went wrong.",
            success:false
        })
    }
}

export const getAllJobs = async(req,res)=>{
    try{
        const keyword = req.query.keyword || "";
        // console.log("Debugger 1")
        const query = {
            $or:[
                {title:{$regex:keyword,$options:"i"}},
                {description:{$regex:keyword,$options:"i"}}
            ]
        }
        // console.log("Debugger 2")

        const jobs = await Job.find(query).populate({
            path:'company'
        }).sort({createdAt:-1});

        if(!jobs){
            return res.status(400).json({
                message:"Jobs not found.",
                success:false
            })
        }

        return res.status(200).json({
            jobs,
            success:true
        })
    }catch(error){
        return res.status(400).json({
            message:"Something went wrong.",
            success:false
        })
    }
}

export const getJobById = async(req,res)=>{
    try{
        // console.log(req.params.id);
        // if (!req.id) {
        //     return res.status(401).json({
        //         message: "Unauthorized. Please sign in.",
        //         success: false
        //     });
        // }
        const jobId = req.params.id;
        const job =  await Job.findById(jobId);
        // console.log(job);
        if(!job){
            return res.status(400).json({
                message:"Jobs not found.",
                success:false
            })
        }
        return res.status(200).json({
            job,
            success:true
        })
        
    }catch(error){
        return res.status(400).json({
            message:"Something went wrong.",
            success:false
        })
    }
}
export const getAdminJobs = async(req,res)=>{
    try{
        console.log("Debugger 1")
        const adminId = req.id;
        if(!adminId){
        return res.status(400).json({
            message:"User not Authenticated.",
            success:false
         })
        }
        console.log("Debugger 2")
        const jobs = await Job.find({created_by:adminId});
        if(!jobs){
            return res.status(400).json({
                message:"Jobs not Found",
                success:false
             })
        }
        return res.status(200).json({
            jobs,
            success:true
        })

    }catch(error){
        return res.status(400).json({
            message:"Something went wrong.",
            success:false
        })
    }
}
