import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config({});
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());
const corsOption = {
    origin:'http://localhost:5173',
    credentials:true
};
app.use(cors(corsOption));
const PORT = process.env.PORT || 3000;

// app.get('/home',(req,res)=>{
//     return res.status(200).json({
//         message:"I am coming from Backend",
//         success:true
//     })
// });

app.listen(PORT,()=>console.log(`Server is running at Port no: ${PORT}`));

