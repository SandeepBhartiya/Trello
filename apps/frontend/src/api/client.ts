const BASE_URL=import.meta.env.VITE_API_URL || "http://localhost:3000";

type RequestOptions={
    method?:"GET"|"POST"|"PUT"| "DELETE";
    body?:unknown;
};

export async function apiClient<T>(path:string,option:RequestOptions={}):Promise<T>{
    console.log(`${BASE_URL}${path}`);
    const token=localStorage.getItem("token");

    const res=await fetch(`${BASE_URL}${path}`,{
        method:option.method || "GET",
        headers:{
            "Content-Type":"application/json",
            ...(token?{"Authorization":`Bearer ${token}`}:{}),
        },
        body:option.body?JSON.stringify(option.body):undefined,
    });
    
    if(!res.ok){
        const message=await res.text();
        throw new Error(message || `Request failed:${res.status}`);
    }
    const text=await res.text();
    return text?JSON.parse(text):(undefined as T);
}