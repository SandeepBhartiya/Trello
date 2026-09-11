import { signUp,signIn } from "../services/login";
import {Router} from "express";
const router=Router();

router.post("/signup",async(req,res)=>{
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

router.post("/signin",async(req,res)=>{
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

export default router;