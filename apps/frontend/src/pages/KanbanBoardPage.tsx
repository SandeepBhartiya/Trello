import { useState,useEffect } from "react";
import {useNavigate,useParams} from "react-router";
import { getSections,createSection } from "../api/section";
import { getIssues,createIssue } from "../api/issue";
import SectionColumn from "../components/SectionColumn";
import type { Section,Issue } from "../types";
import { MessageBox } from "../components/MessageBox";
import "../styles/kanban.css";

export default function KanbanBoardPage(){
    const [sections,setSections]=useState<Section[]>([]);
    const [issues,setIssues]=useState<Issue[]>([]);
    const [loading,setLoading]=useState(true);
    const [addingSection,setAddingSection]=useState(false);
    const [newSectionTitle,setNewSectionTitle]=useState("");
    
    const {boardId}=useParams();
    const id=Number(boardId);
    const navigate=useNavigate();

    useEffect(()=>{
        loadBoards();
    },[id])

    const loadBoards=async()=>{
        setLoading(true);
        try{
            const sectionData:Section[]=await getSections(id);
            let issueData:Issue[]=[];

            if(sectionData && sectionData.length>0){
                const issueResult=await Promise.all(
                    sectionData.map((section:any)=>getIssues(id,section.id))
                );
                issueData=issueResult.flat();
            }

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
        try{
            const section:any=await createSection(newSectionTitle.trim(),id);
            setSections((prev)=>[...prev,section?.data]);
            setNewSectionTitle("");
            setAddingSection(false);
            MessageBox({title:"Success",message:"Section created successfully",type:"success"});
        }catch(err:any){
            MessageBox({title:"Error",message:err.message,type:"error"});
        }
    }

    const handelAddIssue=async(sectionId:number,title:string)=>{//in this we don't add desc bc it happen in issue form
        try{
            const issue=await createIssue(id,sectionId,title);
            setIssues((prev)=>[...prev,issue]);
            MessageBox({title:"Success",message:"Issue created successfully",type:"success"});
        }catch(err:any){
            MessageBox({title:"Error",message:err.message,type:"error"});
        }
    }

    const handleIssueClick=(issue:Issue)=>{
        navigate(`/issue/${issue.id}`);
    }

    if(loading)return(<div className="board-loading">Loading...</div>);
    return(
        <div className="kanban-page">
            <div className="kanban-header">
                <h1>Board</h1>
            </div>

            <div className="kanban-board">
                {sections.map((section)=>(
                    <SectionColumn 
                        key={section.id} 
                        section={section} 
                        issues={issues.filter((issue)=>issue.sectionId===section.id)} 
                        onAddIssue={handelAddIssue} 
                        onIssueClick={handleIssueClick}
                    />
                ))}

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
        </div>
    );

}