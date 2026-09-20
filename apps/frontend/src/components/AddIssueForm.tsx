import { useState } from "react";

interface Props{
    onAdd:(title:string)=>void;
    onCancel:()=>void;
}

export default function AddIssueForm({onAdd,onCancel}:Props){
    const [title,setTitle]=useState("");

    const submit=()=>{
        if(title.trim()){
            onAdd(title.trim());
            setTitle("");
        }
    };

    return(
        <div className="kanban-add-card-form">
            <textarea 
                rows={2} 
                autoFocus 
                placeholder="Enter a title..." 
                value={title} 
                onChange={(e)=>setTitle(e.target.value)}
                onKeyDown={(e)=>{
                    if(e.key==="Enter" && e.shiftKey){
                        e.preventDefault();
                        submit();
                    }
                    if(e.key==="Escape"){
                        onCancel();
                    }
                }}
            />
            <div className="kanban-add-card-actions">
                <button className="kanban-add-card-save" onClick={submit}>Add Card</button>
                <button className="kanban-add-card-cancel" onClick={onCancel}>X</button>    
            </div>
        </div>
    )

}