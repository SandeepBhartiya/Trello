import { Router } from "express";
import { authMiddleWare } from "../middleware/auth";
import { checkOrgAccess } from "../middleware/checkOrgAccess";
import { createInvite,acceptInvite } from "../services/invite";
import { removeMembership } from "../services/membership";
import { fromBody } from "../middleware/resolver";

const router=Router();

router.post("/invite",authMiddleWare,checkOrgAccess("admin",fromBody),async(req,res)=>{
    try{
        const {userId,email,orgId}=req.body;
        const result:any=await createInvite(userId,orgId,email);
        if(result?.error){
            return res.status(400).send(result?.message);
        }
        return res.status(201).send(result);

    }catch(err){
        return res.status(500).send("Failed to invite users to organizations");
    }
});

router.post("/accept",authMiddleWare,async(req,res)=>{
    try{
        const {orgId,userId}=req.body;
        const result:any=await acceptInvite(Number(userId),Number(orgId));
        if(result?.error){
            return res.status(400).send(result?.message);
        }
        return res.status(201).send(result);
    }catch(err){
        return res.status(500).send("Failed to accept invite");
    }
});

router.delete("/membership",authMiddleWare,async(req,res)=>{//i think admin can remove member
    try{
        const {userId,targetUserId,orgId}=req.body;
        const result=await removeMembership(Number(userId),Number(targetUserId),Number(orgId));
        if(result?.error){
            return res.status(400).send(result?.message);
        }
        return res.status(201).send(result);
    }catch(err){
        return res.status(500).send("Failed to remove membership");
    }
})

export default router;