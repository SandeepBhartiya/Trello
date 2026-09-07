import {prisma} from "db/client";

export const createComment=async(issueid:number,userid:number,content:string)=>{
    try{
        if(!content){
            return {error:true,message:"Missing required fields"}
        }
        const comment=await prisma.comment.create({data:{issueId:issueid,userId:userid,content}});
        return comment;
    }catch(err){
        console.log(err);
        return {error:true,message:"Failed to create comment"}
    }
}

export const updateComment=async(commentid:number,requsterId:number,content:string)=>{
    try{
        if(!content){
            return {error:true,message:"Missing required fields"}
        }
        const comment=await prisma.comment.findUnique({where:{id:commentid}});
        if(comment?.userId!==requsterId){
            return {error:true,message:"Only the author can edit this comment"};
        }
        const update=await prisma.comment.update({where:{id:commentid},data:{content:content}});
        return update;
    }catch(err){
        console.log(err);
        return {error:true,message:"Failed to update comment"}
    }
}

export const deleteComment=async(commentid:number,requsterId:number,requesterRole:"member"|"admin")=>{
    try{
        const comment=await prisma.comment.findUnique({where:{id:commentid}});
        if(!comment){
            return {error:true,message:"Comment not found"};
        }
        const isAuthor=comment.userId===requsterId;
        const isAdmin=requesterRole==="admin";
        if(!isAuthor && !isAdmin){
            return {error:true,message:"You are not authorized to delete this comment"};
        }
        await prisma.comment.delete({where:{id:commentid}}); //delete comment
        return {success:true};
    }catch(err){
        console.log(err);
        return {error:true,message:"Failed to delete comment"}
    }
}