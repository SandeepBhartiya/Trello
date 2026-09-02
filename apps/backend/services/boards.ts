import { prisma } from "db/client";

export const createBoard=async(title:string,organizationId:number)=>{
    try{
        if(!title){
            return  {error:true,message:"Board Title is required"};
        }
        const board=await prisma.board.create({data:{title:title,organizationId:organizationId}});
        return board;
    }catch(err){
        console.log(err);
        return {error:true,message:"Failed to create board"};
    }
}

export const getBoards=async(organizationId:number)=>{
    try{
        const boards=await prisma.board.findMany({where:{organizationId:organizationId}});
        return boards;
    }catch(err){
        console.log(err);
        return {error:true,message:"Failed to get boards"};
    }
}

export const updateBoards=async(boardId:number,title:string)=>{
    try{ 
        if(!title){
            return{error:true,message:"Board Title is required"}
        }
        const board=await prisma.board.update({where:{id:boardId},data:{title:title}});
        return board;
    }catch(err){
        console.log(err);
        return {error:true,message:"Failed to update board"};
    }
} 

export const deleteBoard=async(boardId:number)=>{
    try{
        const sectionCount=await prisma.section.count({where:{boardId:boardId}});
        if(sectionCount>0){
            return{error:true,message:"Delete all sections before deleting the board"};
        }
        const board=await prisma.board.delete({where:{id:boardId}});
        return board;
    }catch(err){
        console.log(err);
        return {error:true,message:"Failed to delete board"};
    }
}