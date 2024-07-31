import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config({});
const ConnectToDb= async()=>{
    try{
        mongoose.connect(process.env.MONGO_URI);
        console.log("Connection Succesfull.")
    }catch(error){
        console.log(error)
    }
    
}
export default ConnectToDb