import { prisma }  from "db/client";

export const createOrg=async(userId:string,name:string,description:string)=>{
    if(!name){
        return{
            error:true,
            message:"Organization name is required"
        }
    }
    try{
        const orgExists=await prisma.org.findUnique({where:{name:name}});
        if(orgExists){
            return{
                error:true,
                message:"Organization already exists"
            }
        }
        const org=await prisma.$transaction(async(tx)=>{
            const newOrg=await tx.org.create({data:{name:name,description:description}});
            await tx.membership.create({data:{userId,orgId:newOrg.id,role:"admin"}});
            return newOrg;
        });
        return org;
    }catch(err){
        console.log(err);
        return err;
    }
}

export const getOrg=async(userId:string)=>{
    try{
        const membership=await prisma.membership.findMany({where:{userId:userId},include:{org:true}});
        const orgs=membership.map((m)=>({
            ...m.org,
            role:m.role
        }));
        return orgs;
    }catch(err){
        console.log(err);
        return err;
    }
}
export const deleteOrg=async(id:string)=>{
    try{
        const boardCount = await prisma.board.count({
        where: { organizationId: id },
      });
      if (boardCount > 0) {
        return {
            error: true,
            message: "Delete all boards before deleting the organization"
        } 
      }
        const orgExists=await prisma.org.findUnique({where:{id:id}});
        if(!orgExists){
            return{
                error:true,
                message:"Organization does not exists"
            }
        }
        await prisma.$transaction(async(tx)=>{
            await tx.membership.deleteMany({where:{orgId:id}});
            await tx.org.delete({where:{id:id}});
        });
        return;
    }catch(err){
        console.log(err);
        return err;
    }
}