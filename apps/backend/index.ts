import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import loginRoutes from "./routes/login";
import organizationRoutes from "./routes/organization";
import membershipRoutes from "./routes/membership";
import boardRoutes from "./routes/boards";
import sectionRoutes from  "./routes/section";
import issueRoutes from "./routes/issue";
import commentRoutes from "./routes/comment";
dotenv.config({path:__dirname+"/.env"});
const app=express();

app.use(cors({
    origin:process.env.FRONTEND_URL||"http://localhost:5173",
    credentials:true
}));
app.use(express.json())

app.use("/",loginRoutes);
app.use("/organization",organizationRoutes);
app.use("/",membershipRoutes);
app.use("/board",boardRoutes);
app.use("/section",sectionRoutes);
app.use("/issue",issueRoutes);
app.use("/comment",commentRoutes);

app.listen(3000,()=>console.log("Backend server started on port 3000"));