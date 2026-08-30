import { Router } from "express";
import { authMiddleWare } from "../middleware/auth";
import { checkOrgAccess } from "../middleware/checkOrgAccess";
import { createInvite } from "../services/invite";

const router=Router();

router.post("/invite",authMiddleWare,checkOrgAccess("admin"),async(req,res)=>{
    try{
        console.log("req.body",req.body);
        const {userId,email,orgid}=req.body;
        // console.log("emailid",emailid)
        const result=await createInvite(userId,orgid,email);
        console.log("result",result);
        if(result?.error){
            return res.status(500).send(result?.message);
        }
        return res.status(201).send(result);

    }catch(err){
        return res.status(500).send("Failed to invite users to organizations");
    }
});

export default router;