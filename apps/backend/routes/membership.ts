import { Router } from "express";
import { authMiddleWare } from "../middleware/auth";
import { checkOrgAccess } from "../middleware/checkOrgAccess";
import { createInvite,acceptInvite } from "../services/invite";
import { removeMembership,getMembers } from "../services/membership";
import { fromBody,fromQuery } from "../middleware/resolver";

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

router.get("/membership",authMiddleWare,checkOrgAccess("member", fromQuery),async(req,res)=>{
    try{
        const {orgId}=req.query;
        const members:any=await getMembers(Number(orgId));
        if(members?.error){
            return res.status(400).send(members?.message);
        }
        return res.status(200).send(members);
    }catch(err){
        return res.status(500).send("Failed to get members");
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
});

export default router;