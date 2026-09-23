import { apiClient } from "./client";
import type { Comment } from "../types";

export const createComment=(issueId:number,content:string)=>apiClient<Comment>("/comment",{method:"POST",body:{issueId,content}});

export const updateComment=(id:number,content:string)=>apiClient<Comment>(`/comment/${id}`,{method:"PUT",body:{content}});

export const deleteComment=(id:number)=>apiClient<{message:string}>(`/comment/${id}`,{method:"DELETE"});
