import {apiClient} from "./client";
import type {Board} from "../types";

export const getBoards=(orgId:number)=>apiClient<Board[]>(`/board?orgId=${orgId}`,{method:"GET"});

export const createBoard=(title:string,orgId:number)=>apiClient<Board>("/board",{method:"POST",body:{title,orgId}});

export const updateBoard=(id:number,title:string)=>apiClient<Board>(`/board/${id}`,{method:"PUT",body:{title}});   

export const deleteBoards=(id:number)=>apiClient<{message:string}>(`/board/${id}`,{method:"DELETE"});