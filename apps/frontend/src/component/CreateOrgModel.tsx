import { useState } from "react";
import {createOrg} from "../api/organization";
import { validators,runValidation,type FieldErrors } from "../utils/validation";
import type { Org } from "../types";
import { toast } from "react-toastify";
type OrgField="name";

interface Props{
    onClose:()=>void;
    onCreated:(org:Org)=>void;
}

export default function CreateOrgModal({onClose,onCreated}:Props){
    const [name,setName]=useState("");
    const [description,setDescription]=useState("");    
    const [fieldErrors,setFieldErrors]=useState<FieldErrors<OrgField>>({});
    const [formError, setFormError] = useState("");
    const [loading,setLoading]=useState(false);

    const handelSubmit=async(e:React.FormEvent)=>{
        e.preventDefault();
        setFormError("");

        const errors=runValidation<OrgField>({
            name:()=>validators.minLength(name,3)
        });
        setFieldErrors(errors);
        if(Object.keys(errors).length>0)return;
        setLoading(true);
        try{
            const org:any=await createOrg(name,description);
            onCreated(org);
            onClose();
        }catch(err:any){
            toast.error(err.message || "Create Organization Failed");
        }finally{
            setLoading(false);
        }
    }

    return(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={(e)=>e.stopPropagation()}>
                <h2>Create Organization</h2>
                {formError && <p className="form-error">{formError}</p>}
                <form onSubmit={handelSubmit} noValidate>
                    <div className="field-group">
                        <label htmlFor="org-name">Name</label>
                        <input id="org-name"
                            type="text" 
                            value={name}
                            onChange={(e)=>setName(e.target.value)}
                            className={fieldErrors.name ? "input-error":""}
                        />
                        {fieldErrors.name && <div className="field-error">{fieldErrors.name}</div>}
                    </div>
                    <div className="field-group">
                        <label htmlFor="org-description">Description(Optional)</label>
                        <textarea id="org-description"
                            value={description}
                            onChange={(e)=>setDescription(e.target.value)}
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="modal-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="modal-submit" disabled={loading}>{loading ? "Creating...":"Create"}</button>
                    </div>
                </form>

            </div>
        </div>
    )
}