import { useState } from "react";
import {useLoading} from "../context/LoadingContext";
import { toast} from "react-toastify";
import { inviteMember } from "../api/membership";
import { validators, runValidation, type FieldErrors } from "../utils/validation";
import "react-toastify/dist/ReactToastify.css";

type InviteField = "email";
interface Props {
    organizationId: number;
    onClose: () => void;
    onInvited: () => void;
}

export default function InviteMemberModal({ organizationId, onClose, onInvited }: Props) {
    const [email, setEmail] = useState("");
    const [fieldErrors, setFieldErrors] = useState<FieldErrors<InviteField>>({});
    const {loading, setLoading} = useLoading();

    const handleSumit=async(e:React.FormEvent)=>{
        e.preventDefault();
        const errors=runValidation<InviteField>({
            email:()=>validators.email(email)
        });
        setFieldErrors(errors);
        if(Object.keys(errors).length>0)return;
        setLoading(true);
        try{
            await inviteMember(organizationId,email);
            toast.success("Member invited successfully");
            onInvited();
            onClose();
        }catch(err:any){
            toast.error(err.message || "Failed to invite member");
        }finally{
            setLoading(false);
        }
    };

    return(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={(e)=>e.stopPropagation()}>
                <h2>Invite Member</h2>
                <form onSubmit={handleSumit} noValidate>
                    <div className="field-group">
                        <label htmlFor="invite-email">Email</label>
                        <input 
                            id="invite-email" 
                            type="email" 
                            value={email}
                            placeholder="Email"
                            onChange={(e)=>setEmail(e.target.value)}
                            className={fieldErrors.email ? "input-error" : ""}
                            autoFocus
                        />
                        {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="modal-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="modal-submit" disabled={loading}>Send Invite</button>
                    </div>
                </form>
            </div>
        </div>
    );

}