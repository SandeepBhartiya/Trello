import {prisma} from "db/client";

export const createSection=async(boardId:number,title:string)=>{
    try{
        const section=await prisma.section.create({data:{boardId:boardId,title:title}});
        return section;
    }catch(err){
        console.log(err);
        return{error:true,message:"Failed to create section"}
    }
}

export const getSections=async(boardId:number)=>{
    try{
        const section=await prisma.section.findMany({where:{boardId:boardId}});
        return section;
    }catch(err){
        console.log(err);
        return{error:true,message:"Failed to get sections"} 
    }
}

export const updateSections=async(sectionId:number,title:string)=>{
    try{
        const section=await prisma.section.update({where:{id:sectionId},data:{title:title}});
        return section;
    }catch(err){
        console.log(err);
        return{error:true,message:"Failed to update section"};
    }
}

export const deleteSection=async(sectionId:number)=>{
    try{
        await prisma.$transaction(async(tx)=>{
            await tx.issue.updateMany({where:{sectionId:sectionId},data:{sectionId:null}});
            await tx.section.delete({where:{id:sectionId}});
        })
        return {success:true};
    }catch(err){
        console.log(err);
        return{error:true,message:"Failed to delete section"}
    }
}