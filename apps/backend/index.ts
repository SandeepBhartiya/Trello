import express from "express";
import dotenv from "dotenv";
import loginRoutes from "./routes/login";
import organizationRoutes from "./routes/organization";
import membershipRoutes from "./routes/membership";

dotenv.config({path:__dirname+"/.env"});
const app=express();
app.use(express.json())

app.use("/",loginRoutes);
app.use("/organization",organizationRoutes);
app.use("/",membershipRoutes);
app.listen(3000,()=>console.log("Backend server started on port 3000"));