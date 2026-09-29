import { apiClient } from "./client";
import type { Issue,IssueMapping } from "../types";


export const createIssue=(
    boardId:number,
    sectionId:number,
    title:string,
    description?:string)=>apiClient<Issue>("/issue",{method:"POST",body:{boardId,sectionId,title,description}});
    
export const getIssues=(boardId:number,sectionId?:number)=>apiClient<Issue[]>(`/issue?boardId=${boardId}${sectionId?`&sectionId=${sectionId}`:""}`,{method:"GET"});
    
export const getIssue=(id:number)=>apiClient<Issue>(`/issue/${id}`,{method:"GET"});

export const updateIssue=(id:number,title:string,description:string)=>apiClient<Issue>(`/issue/${id}`,{method:"PUT",body:{title,description}});

export const moveIssue=(id:number,sectionId:number|null)=>apiClient<Issue>(`/issue/${id}/move`,{method:"PUT",body:{sectionId}});

export const deleteIssue=(id:number)=>apiClient<{message:string}>(`/issue/${id}`,{method:"DELETE"});

//can be use assignUser in different file
export const assignUser=(issueId:number,assignUserId:number)=>apiClient<IssueMapping>(`/issue/${issueId}/assign`,{method:"POST",body:{assignUserId}});

export const unassignUser=(issueId:number,assignUserId:number)=>apiClient<{message:string}>(`/issue/${issueId}/assign`,{method:"DELETE",body:{assignUserId}});



