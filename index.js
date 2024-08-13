import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from 'dotenv';
import ConnectToDb from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

dotenv.config({});
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const corsOption = {
    origin:'http://localhost:5001',
    credentials:true
};
app.use(cors(corsOption));
const PORT = process.env.PORT || 3000;

app.use("/api/v1/user",userRoute);
app.use("/api/v1/company",companyRoute);
app.use("/api/v1/job",jobRoute);
app.use("/api/v1/application",applicationRoute);
// Base URL: http://localhost:5001//api/v1/user/
// {
//  "fullname":"Sidhe",
//  "email":"sidhfr@gmail.com",
//  "phoneNumber":3218392132,
//  "password":"gamepro123",
//  "role":"recruiter"
// }
// app.get('/home',(req,res)=>{
//     return res.status(200).json({
//         message:"I am coming from Backend",
//         success:true
//     })
// });

app.listen(PORT,()=>{console.log(`Server is running at Port no: ${PORT}`);ConnectToDb();});

