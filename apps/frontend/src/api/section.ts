import { apiClient } from "./client";
import type { Section } from "../types";

export const getSections=(boardId:number)=>apiClient<Section[]>(`/section?boardId=${boardId}`,{method:"GET"});

export const createSection=(title:string,boardId:number)=>apiClient<Section>("/section",{method:"POST",body:{title,boardId}});

export const updateSection=(id:number,title:string)=>apiClient<Section>(`/section/${id}`,{method:"PUT",body:{title}});

export const deleteSection=(id:number)=>apiClient<{message:string}>(`/section/${id}`,{method:"DELETE"});