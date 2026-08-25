import { signupSchema,signinSchema } from "../validation";
import {Resend} from "resend";
import { prisma } from "db/client";
import bcrypt from "bcrypt";
import { signToken } from "../middleware/utils";

const resend=new Resend(process.env.RESEND_API_KEY);

export const signUp=async(username:string,email:string,password:string)=>{
    try{
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
        await sendNotification(email,"Welcome to Trello",`<h1>Welcome to Trello</h1><p>Hi ${username}, you have successfully signed up on Trello</p>`);
        return user;
    }catch(err){
        console.log(err);
        return err;
    }
}

export const signIn=async(email:string,password:string)=>{
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
        const token=signToken({userId:userExists.id});
        return({
            id:userExists.id,
            username:userExists.username,
            email:userExists.email,
            token:token
        });
    }catch(err){
        console.log(err);
        return err;
    }
}

export const sendNotification=async(to:string,subject:string,html:string)=>{
    try{
        return await resend.emails.send({
            from:'Trello App <onboarding@resend.dev>',
            to,
            subject,
            html,
        });
    }catch(err){
        console.error(err);
    }
}