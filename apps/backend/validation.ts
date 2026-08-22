import {z} from "zod";

export const emailSchema=z.string().email({
    message:"Invalid email address"
});
export const passwordSchema=z.string().min(8);
export const usernameSchema=z.string().min(3);


export const signupSchema=z.object({
    email:emailSchema,
    password:passwordSchema,
    username:usernameSchema
});

export const signinSchema=z.object({
    email:emailSchema,
    password:passwordSchema
});