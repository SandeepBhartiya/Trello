export interface User{
    id:number;
    email: String;
    username: String;
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
}

export interface Invite{
    id:number;
    email: String;
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
    title: String;
    description?: String;
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