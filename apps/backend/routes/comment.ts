import { Router } from "express";
import {authMiddleWare} from "../middleware/auth";
import {checkOrgAccess} from "../middleware/checkOrgAccess";
import { fromCommentId, fromIssueId } from "../middleware/resolver";
import { createComment, deleteComment, updateComment } from "../services/comment";

const router=Router();

router.post("/",authMiddleWare,checkOrgAccess("member",fromIssueId),async(req,res)=>{
    try{
        const {issueId,userId,content}=req.body;
        const comment:any=await createComment(Number(issueId),Number(userId),content);
        if(comment?.error){
            return res.status(400).send(comment?.message);
        }
        return res.status(201).send(comment);
    }catch(err){
        console.log(err);
        return res.status(400).send("Failed to create comment");
    }
});

router.put("/:id",authMiddleWare,checkOrgAccess("member",fromCommentId),async(req,res)=>{
    try{
        const {id}=req.params;
        const {userId,content}=req.body;
        const comment:any=await updateComment(Number(id),Number(userId),content);
        if(comment?.error){
            return res.status(400).send(comment?.message);
        }
        return res.status(200).send(comment);
    }catch(err){
        console.log(err);
        return res.status(400).send("Failed to update comment");
    }
});

router.delete("/:id",authMiddleWare,checkOrgAccess("member",fromCommentId),async(req,res)=>{
    try{
        const {id}=req.params;
        const {userId}=req.body;
        const membership=req.body.membership;
        const comment:any=await deleteComment(Number(id),Number(userId),membership?.role);
        if(comment?.error){
            return res.status(400).send(comment?.message);
        }
        return res.status(200).send(comment);
    }catch(err){
        console.log(err);
        return res.status(400).send("Failed to delete comment");
    }
})

export default router;