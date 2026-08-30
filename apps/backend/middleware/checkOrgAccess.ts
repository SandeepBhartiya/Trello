import { Request,Response,NextFunction } from "express";
import {prisma} from "db/client";
type orgRole="member"|"admin";
const roleRank:Record<orgRole,number>={
    member:1,
    admin:2
}
export const checkOrgAccess=(minRole:orgRole="member")=>{
    return async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const userId=req.body.userId as number;
            const orgId=(req.params.id || req.body.orgid) as string;
            if(!orgId){
                return res.status(400).send("OrgId is required");
            }
            const membership=await prisma.membership.findFirst({
                where:{
                    orgId,
                    userId
                },
            });
            const role = membership?.role;
            if (role !== "member" && role !== "admin") {
            return res.status(403).send("Invalid role");
}
            if(!membership){
                return res.status(500).send("You are not a member of this organization");
            }
            if(roleRank[membership.role as orgRole] < roleRank[minRole]){
                 return res.status(500).send(`${minRole} Acess is Required`);
            }
            next();
        }catch(err){
            return res.status(500).send("Failed to check organization access");
        }
    }

}