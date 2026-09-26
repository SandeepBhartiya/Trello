export interface User{
    id:number;
    email: String;
    username: string;
}

export interface Org{
    id:number;
    name: String;
    description: String;
    role?:"admin"|"member";   
}

export interface Membership{
    id:number;
    userId: number;
    orgId: number;
    role: "admin"|"member";   
    accepted: boolean;
    user: { id: number; email: string; username: string };
}

export interface Invite{
    id:number;
    email: string;
    orgId: number;
    status: "pending" | "accepted";
    invitedBy: number;
    createdAt: Date;    
}

export interface Board{
    id:number;
    title: string;
    organizationId: number;
}

export interface Section{
    id:number;
    title: string;
    boardId: number;
}

export interface Issue{
    id:number;
    title: string;
    description?: string;
    boardId: number;
    sectionId: number | null;
}

export interface IssueMapping{
    id:number;
    userId: number;
    issueId: number;
    user?:User;    
}

export interface Comment{
    id:number;
    content: String;
    issueId: number;
    userId: number;
    user: User;
}