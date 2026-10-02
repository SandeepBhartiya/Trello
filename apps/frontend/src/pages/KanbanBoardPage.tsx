import { useState,useEffect } from "react";
import {useNavigate,useParams} from "react-router";
import { useLoading } from "../context/LoadingContext";
import { 
    DndContext,
    DragOverlay,
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors,
    type DragStartEvent,
    type DragEndEvent } from "@dnd-kit/core";
import { getSections,createSection } from "../api/section";
import { getIssues,createIssue, deleteIssue,moveIssue } from "../api/issue";
import SectionColumn from "../components/SectionColumn";
import IssueCard from "../components/IssueCard";
import type { Section,Issue } from "../types";
import { MessageBox } from "../components/MessageBox";
import "../styles/kanban.css";

export default function KanbanBoardPage(){
    const [sections,setSections]=useState<Section[]>([]);
    const [issues,setIssues]=useState<Issue[]>([]);
    const {loading,setLoading}=useLoading();
    const [addingSection,setAddingSection]=useState(false);
    const [newSectionTitle,setNewSectionTitle]=useState("");
    const [activeIssue,setActiveIssue]=useState<Issue|null>(null);
    
    const {boardId}=useParams();
    const id=Number(boardId);
    const navigate=useNavigate();
    const unsectionedIssues = issues.filter((i) => i.sectionId === null);

    const sensors=useSensors(
      useSensor(PointerSensor,{activationConstraint:{distance:5}})  
    );
    
    useEffect(()=>{
        loadBoards();
    },[id])

    const loadBoards=async()=>{
        setLoading(true);
        try{
            const sectionData:Section[]=await getSections(id);
            const issueData:Issue[]=await getIssues(id);
            setSections(sectionData??[]);
            setIssues(issueData??[]);
            MessageBox({title:"Success",message:"Board loaded successfully",type:"success"});
        }catch(err:any)
        {
            MessageBox({title:"Error",message:err.message,type:"error"});
        }finally{
            setLoading(false);
        }
    }

    const handleAddSection=async()=>{
        if(!newSectionTitle.trim())return;
        setLoading(true);
        try{
            const section:any=await createSection(newSectionTitle.trim(),id);
            setSections((prev)=>[...prev,section?.data]);
            setNewSectionTitle("");
            setAddingSection(false);
            MessageBox({title:"Success",message:"Section created successfully",type:"success"});
        }catch(err:any){
            MessageBox({title:"Error",message:err.message,type:"error"});
        }finally{
            setLoading(false);
        }
    }

    const handleAddIssue=async(sectionId:number,title:string)=>{//in this we don't add desc bc it happen in issue form
        setLoading(true);
        try{
            const issue=await createIssue(id,sectionId,title);
            setIssues((prev)=>[...prev,issue]);
            MessageBox({title:"Success",message:"Issue created successfully",type:"success"});
        }catch(err:any){
            MessageBox({title:"Error",message:err.message,type:"error"});
        }finally{
            setLoading(false);
        }
    }

    const handleIssueDelete=async(issueId:number)=>{ //need to check as issue form is not created now
        setLoading(true);
        try{
            await deleteIssue(issueId);
            setIssues((prev)=>prev.filter((i)=>i.id!==issueId));
        }catch(err:any){
            MessageBox({title:"Error",message:err.message,type:"error"});
        }finally{
            setLoading(false);
        }
    }

    const hanleSectionUpdate=async(update:Section)=>{
        setSections((prev)=>prev.map((s)=>(s.id===update.id?update:s)));
    }

    const handleSectionDelete=async(sectionId:number)=>{
        setLoading(true);
        try{
            setSections((prev)=>prev.filter((section)=>section.id!==sectionId));
            setIssues((prev)=> prev.map((i) => (i.sectionId === sectionId ? { ...i, sectionId: null } : i)));
        }catch(err:any){
            
        }finally{
            setLoading(false);
        }
    }

    const handleIssueClick=(issue:Issue)=>{
        navigate(`/issue/${issue.id}`);
    }

    const handleDragStart = (event: DragStartEvent) => {
        const issue = issues.find((i) => i.id === event.active.id);
        setActiveIssue(issue ?? null);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        setActiveIssue(null);
        const { active, over } = event;
        if (!over) return;

        const issueId = Number(active.id);
        const draggedIssue = issues.find((i) => i.id === issueId);
        if (!draggedIssue) return;

        // figure out the target section: either dropped directly on a column,
        // or dropped on another issue (inherit that issue's section)
        let targetSectionId: number | null = null;
        const overData = over.data.current;

        if (overData?.type === "section") {
        targetSectionId = overData.sectionId;
        } else if (overData?.type === "issue") {
        targetSectionId = overData.issue.sectionId;
        } else {
        return; // dropped somewhere unrecognized
        }

        if (targetSectionId === draggedIssue.sectionId) return; // no actual move

        // optimistic update — reflect the move immediately, before the API confirms
        const previousIssues = issues;
        setIssues((prev) =>
        prev.map((i) => (i.id === issueId ? { ...i, sectionId: targetSectionId } : i))
        );

        try {
            await moveIssue(issueId, targetSectionId);
        } catch (err: any) {
            setIssues(previousIssues); // revert on failure
            MessageBox({title:"Error",message:err.message,type:"error"});
        }
  };

    return(
        <div className="kanban-page">
            <div className="kanban-header">
                <h1>Board</h1>
            </div>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="kanban-board">
                    {sections.map((section)=>(
                        <SectionColumn 
                            key={section.id} 
                            section={section} 
                            issues={issues.filter((issue)=>issue.sectionId===section.id)} 
                            onAddIssue={handleAddIssue} 
                            onIssueClick={handleIssueClick}
                            onIssueDelete={handleIssueDelete}
                            onSectionUpdate={hanleSectionUpdate}
                            onSectionDelete={handleSectionDelete}
                        />
                    ))}
                    {unsectionedIssues.length > 0 && (
                        <SectionColumn
                            key="unsectioned"
                            section={{ id: -1, title: "Unsectioned", boardId: id }}
                            issues={unsectionedIssues}
                            onAddIssue={handleAddIssue}
                            onIssueClick={handleIssueClick}
                            onIssueDelete={handleIssueDelete}
                            onSectionUpdate={() => {}}   
                            onSectionDelete={() => {}}
                        />
                    )}
                    {addingSection?(
                        <div className="kanban-column-new-form">
                            <input
                                autoFocus
                                placeholder="Enter a section title..."
                                value={newSectionTitle}
                                onChange={(e)=>setNewSectionTitle(e.target.value)}
                                onKeyDown={(e)=>{
                                    if(e.key==="Enter" && e.shiftKey){
                                        e.preventDefault();
                                        handleAddSection();
                                    }
                                    if(e.key==="Escape"){
                                        setAddingSection(false);
                                    }
                                }}
                                onBlur={()=>!newSectionTitle  && setAddingSection(false)}
                            />    
                        </div>
                    ):(
                        <div className="kanban-column-new" onClick={()=>setAddingSection(true)}>
                            + Add Section
                        </div>
                    )}
                </div>
                <DragOverlay>
                    {activeIssue ? <IssueCard issue={activeIssue} onClick={() => {}} /> : null}
                </DragOverlay>
            </DndContext>
        </div>
    );

}