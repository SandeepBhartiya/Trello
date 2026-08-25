import { prisma } from "db/client";
import express from "express";
import {signUp,signIn} from "./routes/login";
import {createOrg,getOrg,deleteOrg} from "./routes/organization";
import {authMiddleWare} from "./middleware/auth";
import {checkOrgAccess} from "./middleware/checkOrgAccess";
import dotenv from "dotenv";

dotenv.config({path:__dirname+"/.env"});
const app=express();
app.use(express.json())

app.get("/",async(req,res)=>{
    const users=await prisma.user.findMany();
    res.send(users);
})

app.post("/signup",async(req,res)=>{
    try{
        const {username,email,password}=req.body;
        const signup:any=await signUp(username,email,password);
        if(signup?.error){
           return res.status(500).send(signup?.message);
        }
        return res.status(201).send(signup);
    }catch(err)
    {
        console.log(err);
        return res.status(500).send(err);
    }
});

app.get("/signin",async(req,res)=>{
    try {
       const {email,password}=req.body;
       const signin:any=await signIn(email,password);
       if(signin?.error){
        return res.status(500).send(signin?.message);
       }
        //localStorage.setItem("token",signin?.token);  //write this code in frontend to store token
       return res.status(201).send(signin);
        
    } catch (err) {
        return res.status(500).send(err);
    }
});

app.post("/organization",authMiddleWare,async(req,res)=>{
    try{
        const {userId,name,description}=req.body;
        const organization:any=await createOrg(userId,name,description);
        if(organization?.error){
            return res.status(500).send(organization?.message);
        }
        return res.status(201).send(organization);
    }catch(err){
        return res.status(500).send(err);
    }
});

app.get("/organization",authMiddleWare,async(req,res)=>{
    try{
        const userId=req.body.userId;
        const organizations:any=await getOrg(userId);
        if(organizations?.error){
            return res.status(500).send(organizations?.message);
        }
        if(organizations?.length>0){
            return res.status(200).send(organizations);
        }
    }catch(err){
        return res.status(500).send("Failed to fetch organizations");
    }
});

app.delete("/organization/:id",authMiddleWare,checkOrgAccess("admin"),async(req,res)=>{
    try{
        const {id}=req.params as {id:string};
        console.log("id",id,typeof id);
        const deletedOrg:any=await deleteOrg(id);
        if(deletedOrg?.error){
            return res.status(500).send(deletedOrg?.message);
        }
        return res.status(200).send(deletedOrg);
    }catch(err){

    }
})
app.listen(3000,()=>console.log("Backend server started on port 3000"));