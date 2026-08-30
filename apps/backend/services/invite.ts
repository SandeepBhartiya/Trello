import {prisma} from "db/client";
import {sendInviteEmail} from "../utils/email";
export const createInvite=async(inviteId:Number,orgId:string,emailid:string)=>{
    try{
        console.log("Before---",inviteId,"orgId",orgId,"emailid",emailid);
        const existingUser=await prisma.user.findUnique({where:{email:emailid}});
        // console.log("existingUser",existingUser,existingUser?.id,"orgId",orgId);
        if(existingUser){
            console.log("inside --4",typeof existingUser.id);
            const existingMembership=await prisma.membership.findMany({where:{userId:existingUser?.id,orgId:orgId}});
            console.log("existingMembership",existingMembership);
            // if(existingMembership){
            //     return{
            //         error:true,
            //         message:"User already member of this organization"
            //     }
            // }
        }
        console.log("existingUser",existingUser);
        const existingInvite=await prisma.invite.findMany({where:{email:emailid,orgId:orgId}});
        console.log("existingInvite",existingInvite);
        if(existingInvite && existingInvite?.status==="pending"){
            return{
                error:true,
                message:"Invite already pending for this email"
            }
        }
        console.log("before creating invite")
        const invite=await prisma.invite.upsert({where:{email:emailid,orgId:orgId},update:{status:"pending",invitedBy:existingUser?.id},create:{email:emailid,orgId:orgId,status:"pending",invitedBy:existingUser.id}});
        console.log("invite",invite);
        const orgname=await prisma.org.findUnique({where:{id:orgId},select:{name:true}});
        await prisma.invite.create({data:{email:emailid,orgId:orgId,invitedBy:existingUser.id}});
        const inviteLink=`http://localhost:3000/invite/${inviteId}`;
        await sendInviteEmail(emailid,orgname,inviteLink);
        return invite;
    }catch(err){

    }
}