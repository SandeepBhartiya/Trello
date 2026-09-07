import {prisma} from "db/client";

export const createIssue=async(boardid:number,sectionid:number,title:string,description:string)=>{
    try{
        if(!title){
            return {error:true,message:"Issue title is required"};
        }
        const issue=await prisma.issue.create({data:{boardId:boardid,sectionId:sectionid,title:title,description:description}});
        return issue;
    }catch(err){
        console.log(err);
        return {error:true,message:"Failed to create issue"}
    }
}

export const getIssues=async(boardid:number,sectionid:number)=>{
    try{
        const issues=await prisma.issue.findMany({where:{boardId:boardid,...(sectionid?{sectionId:sectionid}:{}),}});        
        return issues;
    }catch(err){
        console.log(err);
        return {error:true,message:"Failed to get issues"}
    }
}

export const getIssueById=async(issueid:number)=>{
    try{
        const issue=await prisma.issue.findUnique({where:{id:issueid},include:{issuesMapping:{include:{user:true}},comments:{include:{user:true}}}});
        return issue;
    }catch(err){
        console.log(err);
        return {error:true,message:"Failed to get issue"}
    }
}

export const updateIssue=async(issueid:number,title:string,description:string)=>{
    try{
        const issue=await prisma.issue.update({where:{id:issueid},data:{...(title&&{title}),...(description!==undefined&&{description})}});
        return issue;
    }catch(err){
        console.log(err);
        return {error:true,message:"Failed to update issue"};
    }
}

export const moveIssue=async(issueid:number,sectionid:number|null)=>{
    try{
        const issue=await prisma.issue.update({where:{id:issueid},data:{sectionId:sectionid}});
        return issue;
    }catch(err){
        console.log(err);
        return {error:true,message:"Failed to move issue"}
    }
}

export const deleteIssue=async(issueid:number)=>{
    try{
        await prisma.$transaction(async(tx)=>{
            await tx.comment.deleteMany({where:{issueId:issueid}});
            await tx.issuesMapping.deleteMany({where:{issueId:issueid}});
            await tx.issue.delete({where:{id:issueid}});
        })
        return {success:true};
    }catch(err){
        console.log(err);
        return {error:true,message:"Failed to delete issue"}
    }
}

export const assignUser=async(issueid:number,userid:number)=>{
    try{
        const existing=await prisma.issuesMapping.findFirst({where:{issueId:issueid,userId:userid}}); //check if user is already assigned to the issue
        if(existing){
            return {error:true,message:"User is already assigned to the issue"};
        }
        const mapping=await prisma.issuesMapping.create({data:{issueId:issueid,userId:userid}}); //assign user to the issue
        return mapping;
    }catch(err){
        console.log(err);
        return {error:true,message:"Failed to assign user"}
    }
}

export const unassignUser=async(issueid:number,userid:number)=>{
    try{
        const mapping=await prisma.issuesMapping.deleteMany({where:{issueId:issueid,userId:userid}}); //unassign user from the issue
        return mapping;
    }catch(err){
        console.log(err);
        return {error:true,message:"Failed to unassign user"}
    }
}