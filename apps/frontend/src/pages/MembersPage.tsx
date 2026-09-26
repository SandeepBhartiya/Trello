import { useState,useEffect } from "react";
import {useParams} from "react-router";
import { getMembers,removeMembership } from "../api/membership";
import { MessageBox } from "../components/MessageBox";
import {useAuth} from "../context/AuthContext"
import InviteMemberModal from "../components/InviteMemberModal";
import type { Membership } from "../types";
import "../styles/members.css";
import { getAvatarColor } from "../utils/avatarColor";

export default function MembersPage(){
    const {orgId}=useParams();
    const id=Number(orgId);
    const {user}=useAuth();
    const [members,setMembers]=useState<Membership[]>([]);
    const [loading,setLoading]=useState(true);
    const [showInviteModal,setShowInviteModal]=useState(false);

    useEffect(()=>{
        loadMembers();
    },[id]);

    const loadMembers=async()=>{
        setLoading(true);
        try{
            const data:any[]=await getMembers(id);
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
        const mssg=targetUserId===user?.id?"Leave this organization":"Remove this member";
        MessageBox({
        title: "Remove Membership",
        message: "Are you sure you want to"+mssg+" ?",
        type: "confirm",
        onConfirm: async () => {
          try {
              await removeMembership(id,Number(targetUserId));
              setMembers((prev:any)=>prev.filter((m:any)=>m.userId!==targetUserId));
              MessageBox({
                title: "Success",
                message: "Member remove successfully",
                type: "success"
              });
            } catch (err: any) {
                MessageBox({
                  title: "Error",
                  message: err.message || "Failed to remove member",
                  type: "error"
                });
              }
            }
        });
    }

    if(loading){
        return <div className="board-loading">Loading...</div>;
    }

    return(
        <div className="members-page">
            <div className="members-header">
                <h1>Members</h1>
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
                        {(isAdmin || member.userId===user?.id) && (
                            <button className="member-remove-btn" onClick={()=>handleRemove(member.userId)}>
                                {member.userId===user?.id?"Leave":"Remove"}
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