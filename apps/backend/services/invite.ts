import {prisma} from "db/client";
import {sendInviteEmail} from "../utils/email";
export const createInvite=async(inviteId:number,orgId:number,emailid:string)=>{
    try{
        const existingUser=await prisma.user.findUnique({where:{email:emailid}});
        if(!existingUser){ //check if user exists
            return{
                error:true,
                message:"Invited User does not exists"
            }
        }
        const existingMembership=await prisma.membership.findMany({where:{userId:existingUser?.id,orgId:orgId}});
        if(existingMembership.length>0){  //check if user is already a member of the organization
            return{
                error:true,
                message:"User already member of this organization"
            }
        }
        const existingInvite=await prisma.invite.findMany({where:{email:emailid,orgId:orgId}}); //check if invite already exists
        const hasPendingInvite=existingInvite?.some((i)=>i.status==="pending");
        if(hasPendingInvite){
            return{
                error:true,
                message:"Invite already pending for this email"
            }
        }
        const invite=await prisma.invite.upsert({where:{email_orgId:{email:emailid,orgId:orgId},},update:{status:"pending",invitedBy:existingUser?.id},create:{email:emailid,orgId:orgId,status:"pending",invitedBy:existingUser?.id},});
        const org:any=await prisma.org.findUnique({where:{id:orgId},select:{name:true}});
        const inviteLink=`http://localhost:3000/invite/${inviteId}`;
        await sendInviteEmail(emailid,org?.name,inviteLink);
        return invite;
    }catch(err){
        console.log(err);
    }
}

export const acceptInvite=async(userId:number,orgId:number)=>{
    try{
        const user=await prisma.user.findUnique({where:{id:userId}}); //check if user exists
        if(!user)
        {
            return{
                error:true,
                message:"User does not exists"
            }
        }
        const invite:any=await prisma.invite.findUnique({where:{email_orgId:{email:user?.email,orgId:orgId}}}); //check if invite exists
        if(!invite || invite?.status!=="pending"){
            return{
                error:true,
                message:"Pending Invite does not found"
            }
        }
        const membership=await prisma.$transaction(async(tx)=>{
            const newMembership=await tx.membership.create({data:{userId:userId,orgId:orgId,role:"member"}});
            await tx.invite.update({where:{id:invite?.id},data:{status:"accepted"}});
            return newMembership;
        });
        return membership;
    }catch(err){
        console.log(err);
        return {error:true,message:err};
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