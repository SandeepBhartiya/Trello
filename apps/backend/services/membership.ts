import {prisma} from "db/client";

export const checkMembership=async(userId:number,orgId:number)=>{
    try{
        const membership=await prisma.membership.findFirst({where:{userId:userId,orgId:orgId}}); //check if user is a member of the organization
        if(!membership){
            return{
                error:true,
                message:"You are not a member of this organization"
            }
        }
        return membership?.role;
    }catch(err){
        console.log(err);
        return err;
    }
}
export const removeMembership=async(requesterId:number,targetUserId:number,orgId:number)=>{
    try{
        const requesterMembership=await prisma.membership.findFirst({where:{userId:requesterId,orgId:orgId}}); //check if requester is a member of the organization
        if(!requesterMembership){
            return{
                error:true,
                message:"You are not a member of this organization"
            }
        }
        const isSelf=requesterId===targetUserId;
        const isAdmin=requesterMembership.role==="admin";
        if(!isSelf  && !isAdmin){
            return{
                error:true,
                message:"You are not authorized to remove this membership"
            }
        }
        await prisma.membership.deleteMany({where:{userId:targetUserId,orgId:orgId}}); //delete membership
        return {success:true};
    }catch(err){
        console.log(err);
        return{error:true,message:err};
    }
}