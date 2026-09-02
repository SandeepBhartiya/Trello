import {Router} from "express";
import { authMiddleWare } from "../middleware/auth";
import { checkOrgAccess } from "../middleware/checkOrgAccess";
import { createOrg, deleteOrg, getOrg } from "../services/organization";

const router=Router();

router.post("/",authMiddleWare,async(req,res)=>{
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

router.get("/",authMiddleWare,async(req,res)=>{
    try{
        const userId=req.body.userId;
        const organizations:any=await getOrg(userId);
        if(organizations?.error){
            return res.status(500).send(organizations?.message);
        }
        if(organizations?.length>0){
            return res.status(200).send(organizations);
        }else{
            return res.status(200).send("User is not part of any organizations");
        }
    }catch(err){
        return res.status(500).send("Failed to fetch organizations");
    }
});

router.delete("/:id",authMiddleWare,checkOrgAccess("admin",async(req)=>Number(req.params.id)),async(req,res)=>{
    try{
        const id:number=Number(req.params.id);
        const deletedOrg:any=await deleteOrg(id);
        if(deletedOrg?.error){
            return res.status(500).send(deletedOrg?.message);
        }
        return res.status(200).send(deletedOrg);
    }catch(err){
        return res.status(500).send("Failed to delete organizations");
    }
});

export default router;