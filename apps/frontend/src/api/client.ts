const BASE_URL=import.meta.env.VITE_API_URL || "http://localhost:3000";

type RequestOptions={
    method?:"GET"|"POST"|"PUT"| "DELETE";
    body?:unknown;
};

export async function apiClient<T>(path:string,option:RequestOptions={}):Promise<T>{
    const token=localStorage.getItem("token");
    console.log("token",token);
    console.log("path",path);
    console.log("option",option);
    const res=await fetch(`${BASE_URL}${path}`,{
        method:option.method || "GET",
        headers:{
            "Content-Type":"application/json",
            ...(token?{"Authorization":`Bearer ${token}`}:{}),
        },
        body:option.body?JSON.stringify(option.body):undefined,
    });
    console.log("resBODY",res.body);
    console.log("resOK",res.ok);
    // console.log("resTEXT",await res.text());
    if(!res.ok){
        const responseText = await res.text();
        let errorMessage = `Request failed: ${res.status}`;
        if(responseText){
            try{
                const errorData=JSON.parse(responseText);
                errorMessage = errorData.message || errorData.error || responseText;
            }catch(err){
                errorMessage = responseText;
            }
        }
        throw new Error(errorMessage);
    }
    const text=await res.text();
    console.log("text",text);
    console.log("JSON.parse(text)",JSON.parse(text));
    return text?JSON.parse(text):(undefined as T);
}