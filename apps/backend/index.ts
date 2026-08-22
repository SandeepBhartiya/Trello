import { prisma } from "db/client";
import express from "express";
import {signUp,signIn} from "./routes/login";

const app=express();
app.use(express.json())

app.get("/",async(req,res)=>{
    const users=await prisma.user.findMany();
    res.send(users);
})

app.post("/signup",async(req,res)=>{
    try{
        const {username,email,password}=req.body;
        const signup:any=await signUp({username,email,password});
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
       const signin:any=await signIn({email,password});
       if(signin?.error){
        return res.status(500).send(signin?.message);
       }
       return res.status(201).send(signin);
        
    } catch (err) {
        return res.status(500).send(err);
    }
});

app.listen(3000,()=>console.log("Backend server started on port 3000"));