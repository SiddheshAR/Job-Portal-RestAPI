import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs'

export const register = async(req,res) =>{
    try{
        const {fullname,email,phoneNumber,password,role} = req.body;
        if(!fullname || !email || !phoneNumber || !password || !role){
            return res.status(400).json({
                message:"Something went wrong.",
                success:false
            })
        };
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                message:"User already exists",
                success:false
            })
        }
        const hashedPassword = await bcrypt.hash(password,12);
        await User.create({
            fullname,
            email,
            phoneNumber,
            password:hashedPassword,
            role
        })
        return res.status(201).json({
            message:"Account created succesfully.",
            success:true
        })
    }catch(error){
        console.log(error);
    }
}

export const login = async(req,res)=>{
    console.log("Logging in here.")
    try{
    const {email,password,role} = req.body;
    if(!email || !password || !role){
        return res.status(400).json({
            message:"Please provide all credentials.",
            success:false
        })
    }
    let user = await User.findOne({email});
    if(!user){
        return res.status(400).json({
            message:"User doesn't exist",
            success:false
        })
    }
    const isPasswordMatch = await bcrypt.compare(password,user.password);
    if(!isPasswordMatch){
        return res.status(400).json({
            message:"Invalid Credentials",
            success:false
        })
    }
    if((role!=user.role)){
        return res.status(400).json({
            message:"Incorrect Role selected,Please select correct role.",
            success:false
        })
    }
    const tokenData = {
        userId:user._id
    }
    const token = await jwt.sign(tokenData,process.env.SECRET_KEY,{expiresIn:'1d'});
    user = {
        _id:user._id,
        fullname:user.fullname,
        email:user.email,
        phoneNumber:user.phoneNumber,
        role:user.role,
        profile:user.profile,
    }
    
    return res.status(200).cookie("token",token,{
        maxAge:1*24*60*60*1000,httpsOnly:true,sameSite:'strict'
    }).json({
        message:`Welcome ${user.fullname}`,
        user,
        success:true
    });
    }catch(error){
        console.log(error)
    }
}

export const logout = async(req,res)=>{
    try{
        return res.status(200).cookie("token","",{maxAge:0}).json({
            message:"Logged out successfully",
            success:true
        })
    }catch(error){
        console.log(error)
    }
}

export const updateProfile = async(req,res)=>{
    console.log("Updating Profile.")
    try{
        let {fullname,email,phoneNumber,bio,skills} = req.body;
        console.log("Updating Profile.1")
        if(!fullname || !email || !phoneNumber || !bio || !skills){
            return(res.status(400).json({
                message:"Some Data is missing.",
                success:false
            }))
        }
        const userId = req.id; //Middleware authentication.
        let user = await User.findById(userId);
        // console.log(user);
        if(!user){
            return(res.status(400).json({
                message:"User doesnt exist",
                success:false
            }))
        }

        let skillsArray;
        if(skills){
            skillsArray = skills.split(",");
        }

        if(fullname) user.fullname = fullname
        if(email) user.email = email
        if(phoneNumber)  user.phoneNumber = phoneNumber
        if(bio) user.profile.bio = bio
        if(skills) user.profile.skills = skillsArray

        let saveStatus=await user.save();
        if(saveStatus){
            return res.status(200).json({
                message:"Profile updated successfully.",
                success:true
            })
        }else{
            return res.status(400).json({
                message:"Schema Error",
                success:false
            })
        }
        
        // user = {
        //     _id: user._id,
        //     fullname: user.fullname,
        //     email: user.email,
        //     phoneNumber: user.phoneNumber,
        //     role: user.role,
        //     profile: user.profile
        // }

        // return res.status(200).json({
        //     message:"Profile updated successfully.",
        //     user,
        //     success:true
        // })

    }catch(error){
        return res.status(400).json({
            message:"Profile Update Failed",
            success:false
        })
    }
}





