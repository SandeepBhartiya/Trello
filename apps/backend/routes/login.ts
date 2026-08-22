import { signupSchema,signinSchema } from "../validation";
import { prisma } from "db/client";
import bcrypt from "bcrypt";

export const signUp=async({username,email,password})=>{
    try{
        console.log("Data",username,email,password);
        const validSignUp=signupSchema.safeParse({username:username,email:email,password:password});
        console.log("Validation",validSignUp);
        if(!validSignUp.success)
        {
            console.log(validSignUp.error.flatten().fieldErrors);
           return {
                error: true,
                message: validSignUp.error.flatten().fieldErrors,
            };
        }
        const userExists=await prisma.user.findUnique({where:{email:email}});
        console.log("userExists",userExists);
        if(userExists){
            return {
                error: true,
                message: "User already exists",
            };
        }
        const hashPassword=await bcrypt.hash(password,10);
        const user=await prisma.user.create({
           data:{
            username:username,
            email:email,
            password:hashPassword,
           },
        });
        return user;
    }catch(err){
        console.log(err);
        return err;
    }
}

export const signIn=async({email,password})=>{
    try{
        const validSignIn=signinSchema.safeParse({email:email,password:password});
        if(!validSignIn.success)
        {
            return {
                error: true,
                message: validSignIn.error.flatten().fieldErrors,
            };
        }
        const userExists=await prisma.user.findUnique({where:{email:email}});
        if(!userExists){
             return {
                error: true,
                message: "User does not exists",
            };
        }
        const validPassword=await bcrypt.compare(password,userExists.password);
        if(!validPassword){
            return {
                error:true,
                message:"Invalid password"
            }
        }
        return({
            id:userExists.id,
            username:userExists.username,
            email:userExists.email
        });
    }catch(err){
        console.log(err);
        return err;
    }
}