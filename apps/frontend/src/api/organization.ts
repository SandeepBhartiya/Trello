import { apiClient } from "./client";
import type { Org } from "../types";
//gotta check this getOrg function some unknow error
export const getOrg=()=>{apiClient<Org[]>("/organization");}


export const createOrg=(name:string,description:string)=>apiClient<Org>("/organization", {method:"POST",body:{name,description}});


export const deleteOrg=(id:number)=>apiClient<{message:string}>(`/organization/${id}`,{method:"DELETE"});

    