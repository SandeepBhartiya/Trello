import { useState } from "react";
import IssueCard from "./IssueCard";
import AddIssueForm from "./AddIssueForm";
import type { Section,Issue } from "../types";

interface Props {
    section: Section;
    issues: Issue[];
    onAddIssue:(sectionId:number,title:string)=>void;
    onIssueClick:(issue:Issue)=>void;
}

export default function SectionColumn({section,issues,onAddIssue,onIssueClick}: Props) {
    const [adding,setAdding]=useState(false);
    return(
        <div className="kanban-column">
            <div className="kanban-column-header">
                <div>
                    <div className="kanban-column-title">{section.title}</div>
                    <div className="kanban-column-count">{issues.length}</div>
                </div>
            </div>

            <div className="kanban-cards">
                {issues.map((issue)=>(
                    <IssueCard key={issue.id} issue={issue} onClick={()=>onIssueClick(issue)}/>
                ))}
            </div>
            {adding?(
                <AddIssueForm onAdd={(title)=>onAddIssue(section.id,title)} onCancel={()=>setAdding(false)}/>
            ):(
                <button className="kanban-add-card-btn" onClick={()=>setAdding(true)}>+ Add Card</button>
            )}
        </div>


    );
}