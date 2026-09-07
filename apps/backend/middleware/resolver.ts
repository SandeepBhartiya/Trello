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

export const fromSectionId=async(req:Request)=>{
    const sectionId=req.params.id || req.body.sectionId;
    if(!sectionId){
        return null;
    }
    const section=await prisma.section.findUnique({where:{id:Number(sectionId)},include:{board:true}});
    return section?.board.organizationId??null;
}

export const fromIssueId=async(req:Request)=>{
    const issueId=req.params.id || req.body.issueId;
    if(!issueId){
        null;
    }
    const issue:any=await prisma.issue.findUnique({where:{id:Number(issueId)},include:{board:true}});
    return issue?.board.organizationId??null;
}

export const fromIssueIdForComment=fromIssueId;

export const fromCommentId=async(req:Request)=>{
    const commentId=req.params.id || req.body.commentId;
    if(!commentId){
        return null;
    }
    const comment:any=await prisma.comment.findUnique({where:{id:Number(commentId)},include:{issue:{include:{board:true}}}});
    return comment?.issue.board.organizationId??null;
}