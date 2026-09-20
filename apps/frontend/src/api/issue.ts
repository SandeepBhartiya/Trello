import { apiClient } from "./client";
import type { Issue } from "../types";


export const createIssue=(
    boardId:number,
    sectionId:number,
    title:string,
    description?:string)=>apiClient<Issue>("/issue",{method:"POST",body:{boardId,sectionId,title,description}});
    
export const getIssues=(boardId:number,sectionId:number)=>apiClient<Issue[]>(`/issue?boardId=${boardId}&sectionId=${sectionId}`,{method:"GET"});
    
export const getIssue=(id:number)=>apiClient<Issue>(`/issue/${id}`,{method:"GET"});

export const updateIssue=(id:number,title:string,description:string)=>apiClient<Issue>(`/issue/${id}`,{method:"PUT",body:{title,description}});

export const moveIssue=(id:number,sectionId:number|null)=>apiClient<Issue>(`/issue/${id}/move`,{method:"PUT",body:{sectionId}});

export const deleteIssue=(id:number)=>apiClient<{message:string}>(`/issue/${id}`,{method:"DELETE"});

//can be use assignUser in different file
export const assignUser=(id:number,userId:number)=>apiClient<Issue>(`/issue/${id}/assign`,{method:"POST",body:{userId}});

export const unassignUser=(id:number,userId:number)=>apiClient<Issue>(`/issue/${id}/assign`,{method:"DELETE",body:{userId}});



