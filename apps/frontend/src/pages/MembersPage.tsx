import { useState,useEffect } from "react";
import {useParams} from "react-router";
import { useLoading } from "../context/LoadingContext";
import { getMembers,removeMembership } from "../api/membership";
import { MessageBox } from "../components/MessageBox";
import {useAuth} from "../context/AuthContext"
import InviteMemberModal from "../components/InviteMemberModal";
import type { Membership } from "../types";
import "../styles/members.css";
import { getAvatarColor } from "../utils/avatarColor";
import { getUserIdFromToken } from "../utils/jwt";

export default function MembersPage(){
    const {orgId}=useParams();
    const id=Number(orgId);
    const {user,token}=useAuth();
    const [members,setMembers]=useState<Membership[]>([]);
    const {loading,setLoading}=useLoading();
    const [showInviteModal,setShowInviteModal]=useState(false);
    const [userId,setUserId]=useState<number>();
    
    useEffect(()=>{
        loadMembers();
    },[id]);

    const loadMembers=async()=>{
        setLoading(true);
        try{
            const data:any[]=await getMembers(id);
            const userid:any=getUserIdFromToken(token);
            setUserId(userid);
            setMembers(data ?? []);
        }catch(err:any){
            MessageBox({title:"Error",message:err.message,type:"error"});
        }finally{
            setLoading(false);
        }
    };
    const myMembership = members.find((m) => m.user.username === (user as any));
    const isAdmin = myMembership?.role === "admin";
    const handleRemove=async(targetUserId:number)=>{
        const mssg=targetUserId===userId?" Leave this organization":" Remove this member";        
        MessageBox({
        title: "Remove Membership",
        message: "Are you sure you want to"+mssg+" ?",
        type: "confirm",
        onConfirm: async () => {
          try {
                setLoading(true);
                await removeMembership(id,Number(targetUserId));
                setMembers((prev:any)=>prev.filter((m:any)=>m.userId!==targetUserId));
                MessageBox({
                    title: "Success",
                    message: `${mssg} successfully`,
                    type: "success"
                });
            } catch (err: any) {
                MessageBox({
                  title: "Error",
                  message: err.message || `Failed to ${mssg}`,
                  type: "error"
                });
            }finally{
                    setLoading(false);
                }
            }
        });
    }

    return(
        <div className="page-container page-container--narrow">
            <div className="page-header">
                <h1 className="page-title">Members</h1>
                {isAdmin && (
                    <button className="org-create-btn" onClick={()=>setShowInviteModal(true)}>
                        +Invite Member
                    </button>   
                )}
            </div>
            {members.map((member)=>(
                <div key={member.id} className="member-row">
                    <div className="member-row-left">
                        <div className="member-avatar" style={{background:getAvatarColor(member?.user?.username)}}>
                            {member?.user?.username?.slice(0,2)}
                        </div>
                        <div>
                            <div className="member-name">{member?.user?.username}</div>
                            <div className="member-email">{member?.user?.email}</div>
                        </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center"}}>
                        {!member.accepted && <span className="invite-pending-badge">Pending</span>}
                        <span className={`member-role ${member.role==="admin"?"admin":""}`}>{member.role}</span>
                        {(isAdmin || member.userId===userId) && (
                            <button className="member-remove-btn" onClick={()=>handleRemove(member.userId)}>
                                {member.userId===userId?"Leave":"Remove"}
                            </button>
                        )}
                    </div>
                </div>
            ))}
            {showInviteModal && (
                <InviteMemberModal
                    organizationId={id}
                    onClose={() => setShowInviteModal(false)}
                    onInvited={loadMembers}
                />
            )}
        </div>
    );
}