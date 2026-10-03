import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {useLoading} from "../context/LoadingContext";
import { SortableContext,verticalListSortingStrategy } from "@dnd-kit/sortable";
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
    const {loading,setLoading}=useLoading();
    const isSynthetic = section.id === -1;

    const {setNodeRef,isOver}=useDroppable({
        id:`section-${section.id}`,
        data:{type:"section",sectionId:section.id}
    });

    const handelTitleSave=async()=>{
        setEditingTitle(false);
        if(!title.trim()||title.trim()===section.title){
            setTitle(section.title);
            return;
        }
        setLoading(true);
        try{
            const updated:any=await updateSection(section.id,title.trim());
            onSectionUpdate(updated);
        }catch(err){
            setTitle(section.title);
        }finally{
            setLoading(false);
        }
    }

    const handelSectionDelete=async(sectionid:number)=>{
        MessageBox({
            title: "Delete Section",
            message: "Are you sure you want to delete this section?",
            type: "confirm",
            onConfirm: async () => {
                setLoading(true);
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
                }finally{
                    setLoading(false);
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
                setLoading(true);
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
                }finally{
                    setLoading(false);
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
                            if(e.key==="Enter"){
                                handelTitleSave();
                            }
                            if(e.key==="Escape"){
                                setTitle(section.title);
                                setEditingTitle(false);
                            }
                        }}  
                    /> 
                ):(
                <div onClick={()=>!isSynthetic && setEditingTitle(true)} style={{cursor:isSynthetic ?"default":"text",flex:1}}>
                    <div className="kanban-column-title">{section.title}</div>
                    <div className="kanban-column-count">{issues.length}</div>
                </div>
                )}
                {!isSynthetic && (
                    <div className="kanban-column-actions">
                    <button className="kanban-icon-btn" onClick={() => setEditingTitle(true)}>✎</button>
                    <button
                        className="kanban-icon-btn danger"
                        onClick={(e) => {
                        e.stopPropagation();
                        handelSectionDelete(section.id);
                        }}
                    >
                        🗑️
                    </button>
                    </div>
                )}
            </div>
            
            <SortableContext items={issues.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                <div ref={setNodeRef} className={`kanban-cards ${isOver ? "drag-over" : ""}`}>
                {issues.map((issue) => (
                    <div key={issue.id} className="kanban-card-wrap">
                    <IssueCard issue={issue} onClick={() => onIssueClick(issue)} />
                    <div className="kanban-card-actions">
                        <button
                        className="kanban-icon-btn danger"
                        onClick={(e) => {
                            e.stopPropagation();
                            handelIssueDelete(issue.id);
                        }}
                        >
                        🗑
                        </button>
                    </div>
                    </div>
                ))}
                </div>
            </SortableContext>
            {adding?(
                <AddIssueForm 
                onAdd={(title)=>{
                    onAddIssue(section.id,title);
                    setAdding(false);
                }} 
                onCancel={()=>setAdding(false)}/>
            ):(
                <button className="kanban-add-card-btn" onClick={()=>setAdding(true)}>
                    + Add Card
                </button>
            )}
        </div>
    );
}