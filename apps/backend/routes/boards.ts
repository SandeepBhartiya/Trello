import { Router } from "express";
import { authMiddleWare } from "../middleware/auth";
import  { checkOrgAccess } from "../middleware/checkOrgAccess";
import {createBoard,getBoards,updateBoards,deleteBoard} from "../services/boards";
import { fromBoardId, fromBody, fromQuery } from "../middleware/resolver";
import { checkMembership } from "../services/membership";
const router=Router();
router.post("/",authMiddleWare,checkOrgAccess("member",fromBody),async(req,res)=>{
    try{
        const {orgId,title}=req.body;
        const board:any=await createBoard(title,orgId);
        if(board?.error){
            return res.status(400).send(board?.message);
        }
        return res.status(201).send(board);
    }catch(err){
        console.log(err);
        return res.status(500).send("Failed to create board");
    }
});

router.get("/",authMiddleWare,checkOrgAccess("member",fromQuery),async(req,res)=>{
    try{
        const organizationId:any=req.query.orgId;
        const userId:any=req.body.userId;
        if(!organizationId){
            return res.status(400).send("organizationId is required");
        }
        const boards:any=await getBoards(Number(organizationId));
        const role=await checkMembership(Number(userId),Number(organizationId));
        if(boards?.error){
            return res.status(400).send(boards?.message);
        }
        return res.status(200).send({boards,role});
    }catch(err){
        console.log(err);
        return res.status(500).send("Failed to get boards");
    }
});

router.put("/:id",authMiddleWare,checkOrgAccess("member",fromBoardId),async(req,res)=>{
    try{
        const {id}=req.params;
        const {title}=req.body; 
        const board:any=await updateBoards(Number(id),title);
        if(board?.error){
            return res.status(400).send(board?.message);
        }
        return res.status(200).send(board);
    }catch(err){
        console.log(err);
        return res.status(500).send("Failed to update board");
    }
});

router.delete("/:id",authMiddleWare,checkOrgAccess("admin",fromBoardId),async(req,res)=>{
    try{
        const {id}=req.params;
        const board:any=await deleteBoard(Number(id));
        if(board?.error){
            return res.status(400).send(board?.message);
        }
        return res.status(200).send(board);
    }catch(err){
        console.log(err);
        return res.status(500).send("Failed to delete board");
    }
});

export default router;  