import { Company } from "../models/company.model.js"


export const registerCompany = async(req,res)=>{
    try{
        let {companyName} = req.body;
        if(!companyName){
            return res.status(400).json({
                message:"Please provide Valid Company Name",
                success:false
            });           
        }
    let company = await Company.findOne({companyName});
    if(company){
        return res.status(400).json({
            message:"Company name is already present",
            success:false
        })
    };
    company={
        name:companyName,
        userId:req.id
    }
    let companySaveStatus=await Company.create(company);
    if(!companySaveStatus){
        return res.status(400).json({
            message:"Error Creating Data.",
            success:false
        })
    }else{
        return res.status(201).json({
            message:"Company registered Successfully.",
            success:true
        })
    }

    }catch(error){
        return res.status(400).json({
            message:"Facing Error",
            success:false
        })
    }
}

export const getCompany = async(req,res)=>{
    try{
        let {userId} = req.id;
        if(!userId){
            return res.status(400).json({
                message:"User not Login/Please Login and check",
                success:false
            })
        }
        let company = await Company.findById(userId);
        if(!company){
            return res.status(400).json({
                message:"Company not found",
                success:false
            })
        };
        return res.status(200).json({
            message:"Company found",
            company,
            success:true
        })
        }catch(error){
        return res.status(400).json({
            message:"Facing Error",
            success:false
        })
    }
}

export const getCompanyById =async(req,res)=>{
    try{
        let companyId = req.params.id;
        const company = await Company.findById(companyId);
        if(!company){
            return res.status(400).json({
                message:"Company not found",
                success:false
            })
        }
        return res.status(201).json({
            message:"Company found",
            company,
            success:true
        })
    }catch(error){
        return res.status(400).json({
            message:"Failed to get Details",
            success:false
        })
    }
}

export const updateCompany =async(req,res)=>{
    console.log("Debugger 1 ")
    try{
        // const {userId}=req.id;
        const {name} = req.body;
        
    //   if(!userId){
    //     return res.status(400).json({
    //         message:"Invalid Credentials",
    //         success:false
    //     })
    //   }
    //   let user = await Company.findById(userId);
    //   if(!user){
    //     return res.status(400).json({
    //         message:"Invalid Credentials",
    //         success:false
    //     })
    //   }
      let updatedData = {name};
      let updateStatus =await Company.findByIdAndUpdate(req.params.id,updatedData,{new:true});
      if(!updateStatus){
        return res.status(400).json({
            message:"Update Unsuccesfull.",
            success:false
        })
      }else{
        return res.status(200).json({
            message:"Update Succesfull.",
            success:true
        })
      }

    }catch(error){
        return res.status(400).json({
            message:"Something went wrong.",
            success:false
        })
    }
}

