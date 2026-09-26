import { apiClient } from "./client";
import type { Invite } from "../types";

export const inviteMember=(orgId:number,email:string)=>apiClient<Invite>("/invite",{method:"POST",body:{orgId,email}});

export const acceptInvite=(orgId:number)=>apiClient<Invite>("/accept",{method:"POST",body:{orgId}});

export const getMembers=(orgId:number)=>apiClient<Invite[]>(`/membership?orgId=${orgId}`,{method:"GET"});//works

export const removeMembership=(orgId:number,targetUserId:number)=>apiClient<{Message:string}>("/membership",{method:"DELETE",body:{orgId,targetUserId}});