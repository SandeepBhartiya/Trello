
import {Router} from "express";
import {authMiddleWare} from "../middleware/auth";
import {checkOrgAccess} from "../middleware/checkOrgAccess";
import { fromBoardId, fromIssueId } from "../middleware/resolver";
import { createIssue, deleteIssue, getIssueById, getIssues, moveIssue, updateIssue, assignUser, unassignUser } from "../services/issue";

const router=Router();

router.post("/",authMiddleWare,checkOrgAccess("member",fromBoardId),async(req,res)=>{
    try{
        const {boardId,sectionId,title,description}=req.body;
        const issue:any=await createIssue(Number(boardId),Number(sectionId??null),title,description);
        if(issue?.error){
            return res.status(400).send(issue?.message);
        }
        return res.status(201).send(issue);
    }catch(err){
        console.log(err);
        res.status(400).send("Failed to create issue");
    } 
});

router.get("/",authMiddleWare,checkOrgAccess("member",fromBoardId),async(req,res)=>{
    try{
        const{sectionId,boardId}=req.query;
        const issues:any=await getIssues(Number(boardId),Number(sectionId??null));
        if(issues?.error){
            return res.status(400).send(issues?.message);
        }
        return res.status(200).send(issues);
    }catch(err){
        console.log(err);
        return res.status(400).send("Failed to get issues");
    }
});

router.get("/:id",authMiddleWare,checkOrgAccess("member",fromIssueId),async(req,res)=>{
    try{
        const {id}=req.params;
        const issue:any=await getIssueById(Number(id));
        if(issue?.error){
            return res.status(400).send(issue?.message);
        }
        return res.status(200).send(issue);
    }catch(err){
        console.log(err);
        return res.status(400).send("Failed to get issue");
    }
});

router.put("/:id",authMiddleWare,checkOrgAccess("member",fromIssueId),async(req,res)=>{
    try{
        const {id}=req.params;
        const {title,description}=req.body;
        const issue:any=await updateIssue(Number(id),title,description);
        if(issue?.error){
            return res.status(400).send(issue?.message);
        }
        return res.status(200).send(issue);
    }catch(err){
        console.log(err);
        return res.status(400).send("Failed to update issue");
    }
});

router.put("/:id/move",authMiddleWare,checkOrgAccess("member",fromIssueId),async(req,res)=>{
    try{//should we also consider boardid here 
        const {id}=req.params;
        const {sectionId}=req.body;
        const issue:any=await moveIssue(
            Number(id),
            sectionId !== null && sectionId !== undefined ? Number(sectionId) : null);
        if(issue?.error){
            return res.status(400).send(issue?.message);
        }
        return res.status(200).send(issue);
    }catch(err){
        console.log(err);
        return res.status(400).send("Failed to move issue");
    }
});

router.delete("/:id",authMiddleWare,checkOrgAccess("admin",fromIssueId),async(req,res)=>{
    try{
        const {id}=req.params;
        const issue:any=await deleteIssue(Number(id));
        if(issue?.error){
            return res.status(400).send(issue?.message);
        }
        return res.status(200).send(issue);
    }catch(err){
        console.log(err);
        return res.status(400).send("Failed to delete issue");
    }
});

router.post("/:id/assign",authMiddleWare,checkOrgAccess("admin",fromIssueId),async(req,res)=>{
    try{
        const {id}=req.params;
        const {userId}=req.body;
        const issue:any=await assignUser(Number(id),Number(userId));
        if(issue?.error){
            return res.status(400).send(issue?.message);
        }
        return res.status(200).send(issue);
    }catch(err){
        console.log(err);
        return res.status(400).send("Failed to assign issue");
    }
});

router.delete("/:id/assign",authMiddleWare,checkOrgAccess("admin",fromIssueId),async(req,res)=>{
    try{
        const {id}=req.params;
        const {userId}=req.body;
        const issue:any=await unassignUser(Number(id),Number(userId));
        if(issue?.error){
            return res.status(400).send(issue?.message);
        }  
        return res.status(200).send(issue);
    }catch(err){
        console.log(err);
        return res.status(400).send("Failed to unassign issue");
    }
});

export default router;