import { useState } from "react";
import IssueCard from "./IssueCard";
import AddIssueForm from "./AddIssueForm";
import { updateSection,deleteSection } from "../api/section";
import type { Section,Issue } from "../types";
import { MessageBox } from "./MessageBox";

interface Props {
    section: Section;
    issues: Issue[];
    onAddIssue:(sectionId:number,title:string)=>void;
    onIssueClick:(issue:Issue)=>void;
    onIssueDelete:(issueId:number)=>void;
    onSectionUpdate:(section:Section)=>void;
    onSectionDelete:(sectionId:number)=>void;
}

export default function SectionColumn({section,issues,onAddIssue,onIssueClick,onIssueDelete,onSectionDelete,onSectionUpdate}: Props) {
    const [adding,setAdding]=useState(false);
    const [editingTitle,setEditingTitle]=useState(false);
    const [title,setTitle]=useState(section.title);
    
    const handelTitleSave=async()=>{
        setEditingTitle(false);
        if(!title.trim()||title.trim()===section.title){
            setTitle(section.title);
            return;
        }
        try{
            const updated:any=await updateSection(section.id,title.trim());
            onSectionUpdate(updated);
        }catch(err){
            setTitle(section.title);
        }
    }

    const handelSectionDelete=async(sectionid:number)=>{
        MessageBox({
            title: "Delete Section",
            message: "Are you sure you want to delete this section?",
            type: "confirm",
            onConfirm: async () => {
                try {
                    await deleteSection(sectionid);
                    onSectionDelete(sectionid);
                    MessageBox({
                        title: "Success",
                        message: "Section deleted successfully",
                        type: "success"
                    });
                }catch (err: any) {
                    MessageBox({
                        title: "Error",
                        message: err.message || "Failed to delete board",
                        type: "error"
                    });
                }
            }
        });
    }

    const handelIssueDelete=async(issueid:number)=>{
        MessageBox({
            title: "Delete Issue",
            message: "Are you sure you want to delete this issue?",
            type: "confirm",

            onConfirm: async () => {
                try{
                    await onIssueDelete(issueid);
                    MessageBox({
                        title: "Success",
                        message: "Issue deleted successfully",
                        type: "success"
                    })
                }catch(err:any){
                    MessageBox({
                        title: "Error",
                        message: err.message || "Failed to delete issue",
                        type: "error"
                    })
                }
            }
        })
    }

    return(
        <div className="kanban-column">
            <div className="kanban-column-header">
                {editingTitle?(
                    <input 
                        className="kanban-column-title-input"
                        value={title}
                        autoFocus
                        onChange={(e)=>setTitle(e.target.value)}
                        onBlur={handelTitleSave}
                        onKeyDown={(e)=>{
                            if(e.key==="Enter" && e.shiftKey){
                                handelTitleSave();
                            }
                            if(e.key==="Escape"){
                                setTitle(section.title);
                                setEditingTitle(false);
                            }
                        }}  
                    /> 
                ):(
                <div>
                    <div className="kanban-column-title">{section.title}</div>
                    <div className="kanban-column-count">{issues.length}</div>
                </div>
                )}
                <div className="kanban-column-actions">
                    <div className="kanban-icon-btn" onClick={()=>setEditingTitle(true)}>✎</div>
                    <div className="kanban-icon-btn danger" onClick={(e)=>{e.stopPropagation();handelSectionDelete(section.id)}}>🗑️</div>
                </div>
            </div>


            <div className="kanban-cards">
                {issues.map((issue)=>(
                    <div key={issue.id} className="kanban-card-warp">
                        <IssueCard key={issue.id} issue={issue} onClick={()=>onIssueClick(issue)}/>
                        <div className="kanban-card-actions">
                            <button className="kanban-icon-btn danger" 
                                onClick={(e)=>{e.stopPropagation(); handelIssueDelete(issue.id)}}
                            >🗑</button>
                        </div>
                    </div>
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