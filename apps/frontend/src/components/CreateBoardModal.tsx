import { useState } from "react";
import {createBoard} from "../api/board";
import {validators,runValidation,type FieldErrors} from "../utils/validation";
import {MessageBox} from "./MessageBox";
import type { Board } from "../types";

type BoardField="title";

interface Props{
    organizationId:number;
    onClose:()=>void;
    onCreated:(board:Board)=>void;
}

export default function CreateBoardModal({organizationId,onClose,onCreated}:Props){

    const [title,setTitle]=useState("");
    const [fieldErrors,setFieldErrors]=useState<FieldErrors<BoardField>>({});
    const [formError, setFormError] = useState("");
    const [loading,setLoading]=useState(false);

    const handleSubmit=async(e:React.FormEvent)=>{
        e.preventDefault();
        setFormError("");

        const errors=runValidation<BoardField>({
            title:()=>validators.minLength(title,3)
        });
        setFieldErrors(errors);
        if(Object.keys(errors).length>0)return;
        setLoading(true);
        try{
            console.log("organizationId",organizationId);
            console.log("title",title);
            const board:any=await createBoard(title,organizationId);
            MessageBox({title:"Success",message:"Board created successfully",type:"success"});
            onCreated(board);
            onClose();
        }catch(err:any){
            MessageBox({title:"Error",message:err.message,type:"error"});
        }finally{
            setLoading(false);
        }
    }

    return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2>Create board</h2>

        {formError && <div className="form-error">{formError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="board-title">Title</label>
            <input
              id="board-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={fieldErrors.title ? "input-error" : ""}
              autoFocus
            />
            {fieldErrors.title && <div className="field-error">{fieldErrors.title}</div>}
          </div>

          <div className="modal-actions">
            <button type="button" className="modal-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="modal-submit" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}