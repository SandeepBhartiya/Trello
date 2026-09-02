import {prisma} from  "db/client";
import {Request} from "express";

export const fromBody=async(req:Request)=>req.body.organizationId??req.body.orgId;

export const fromBoardId=async(req:Request)=>{
    const boardId=req.params.id || req.body.boardId;
    if(!boardId){
        return null;
    }
    const board=await prisma.board.findUnique({where:{id:Number(boardId)}});
    return board?.organizationId??null;
}