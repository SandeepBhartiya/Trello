export type FieldErrors<T extends string>=Partial<Record<T,string>>

export const validators={
    required:(value:string,label:string):string|null=>!value.trim()?`${label} is required`:null,

    email:(value:string):string|null=>{
        if(!value.trim())return "Email is required";
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))return "Enter a valid email address";
        return null;
    },

    username:(value:string):string|null=>{
        if(!value.trim())return "Username is required";
        if(value.length<6)return "Username must be at least 3 characters";
        return null;
    },

    password:(value:string):string|null=>{
        if(!value.trim())return "Password is required";
        if(value.length<6)return "Password must be at least 6 characters";
        return null;
    },
    minLength:(value:string,minLength:number):string|null=>value.length<minLength?`Password must be at least ${minLength} characters`:null
};

export function runValidation<T extends string>(
    checks:Record<T,()=>string|null>
):FieldErrors<T>
{
    const errors={} as FieldErrors<T>;
    for(const key in checks){
        const error=checks[key]();
        if(error)errors[key]=error;
    }
    return errors;
}