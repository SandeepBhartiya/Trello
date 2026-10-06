import {useState,useEffect} from "react"
import {useParams,useNavigate} from "react-router"
import {useLoading} from "../context/LoadingContext"
import {ToastContainer, toast} from "react-toastify";
import {updateIssue,getIssue,deleteIssue} from "../api/issue"
import {createComment,updateComment,deleteComment} from "../api/comment"
import { getAvatarColor } from "../utils/avatarColor"
import {useAuth} from "../context/AuthContext"
import type {Issue,Comment,IssueMapping} from "../types"
import { MessageBox } from "../components/MessageBox"
import { assignUser,unassignUser } from "../api/issue"
import {getMembers} from "../api/membership"
import "react-toastify/dist/ReactToastify.css";
import "../styles/issue.css"

export default function IssueDetailPage(){
    const {issueId}=useParams();
    const id=Number(issueId);
    const navigate=useNavigate();
    const {user}=useAuth();

    const [issue,setIssue]=useState<Issue>();
    const [comments,setComments]=useState<Comment[]>([]);
    const {setLoading}=useLoading();

    const [title,setTitle]=useState("");
    const [description,setDescription]=useState("");
    const [editingDesc,setEditingDesc]=useState(false);
    const [editCommentId,setEditCommentId]=useState<number|null>(null);
    const [editContent,setEditContent]=useState("");

    const [newComment,setNewComment]=useState("");
    const [postingComment,setPostingComment]=useState(false);

    const [assignees, setAssignees] = useState<IssueMapping[]>([]);
    const [members, setMembers] = useState<any[]>([]);
    useEffect(()=>{
        loadIssue();
    },[id]);

    const loadIssue=async()=>{
        setLoading(true);
        try{
            const data:any=await getIssue(id);
            setIssue(data);
            setTitle(data?.title||" ");
            setDescription(data?.description||"");
            setComments(data?.comments??[]);
            setAssignees(data?.issuesMapping??[]);
            const orgId=data?.board.organizationId;
            if(orgId){
                const members=await getMembers(orgId);
                setMembers((members ?? []).filter((m: any) => m.accepted));
            }
        }catch(err:any){
            toast.error(err.message || "Failed to load issue");
        }finally{
            setLoading(false);
        }
    }

    const handleTitleBlur=async()=>{
        if(!issue||title.trim()===issue.title)return;
        setLoading(true);
        try{
            const update=await updateIssue(issue.id,title.trim(),description);
            setIssue(update);
        }catch(err:any){        
            toast.error(err.message || "Failed to update title");
        }finally{
            setLoading(false);
        }
    }

    const handleDescriptionSave=async()=>{
        setLoading(true);
        try{
            const updated=await updateIssue(Number(issue?.id),title,description);
            setIssue(updated);
            setEditingDesc(false);
        }catch(err:any){
            toast.error(err.message || "Failed to update description");
        }finally{
            setLoading(false);
        }
    }

    const handleAddComment=async()=>{
        if(!newComment.trim()||!issue)return;
        setPostingComment(true);
        setLoading(true);
        try {
            const comment=await createComment(issue.id,newComment);
            const formattedComment:any={
               user:{
                   username:user
               }
            };
            setComments((prev) => [...prev, { ...comment, ...formattedComment }]);
            toast.success("Comment added successfully");
            setNewComment("");
        } catch (err:any) {
            toast.error(err.message || "Failed to add comment");
        }finally{
            setPostingComment(false);
            setLoading(false);
        }
    }

    const handleUpdateComment=async(commentId:number)=>{
      if(!editContent.trim())return;
      setLoading(true);
      try{
        const updated=await updateComment(commentId,editContent.trim());
        const formattedComment:any={
          user:{
            username:user
          }
        };
        setComments((prev)=>prev.map((comment:any)=>comment.id===commentId?{...updated,...formattedComment}:comment));
        toast.success("Comment updated successfully");
        setEditCommentId(null);
      }catch(err:any){
        toast.error(err.message || "Failed to update comment");
      }finally{
        setLoading(false);
      }
    }

    const handleDeleteComment=async(commentId:number)=>{
      setLoading(true);  
      try{
            await deleteComment(commentId);
            setComments((prev)=>prev.filter((comment)=>comment.id!==commentId));
            toast.success("Comment deleted successfully");
        }catch(err:any){
            toast.error(err.message || "Failed to delete comment");
        }finally{
            setLoading(false);
        }
    }

    const handleDeleteIssue=async()=>{
      if(!issue)return;
      MessageBox({
        title: "Delete Issue",
        message: "Are you sure you want to delete this issue?",
        type: "confirm",
        onConfirm: async () => {
          setLoading(true);
          try {
              await deleteIssue(Number(issueId));
              toast.success("Issue deleted successfully");
              navigate(-1);
            } catch (err: any) {
              toast.error(err.message || "Failed to delete issue");
              }finally{
                setLoading(false);
              }
            }
        });
    }

    const availableMembers = members.filter(
      (m) => !assignees.some((a) => Number(a.userId) === Number(m.userId))
    );

    const handleAssign = async (assignUserId: number) => {
      if (!issue) return;
      setLoading(true);
      try {
        const mapping = await assignUser(issue.id, assignUserId);
        const member = members.find((m) => Number(m.userId) === assignUserId);
        setAssignees((prev) => [...prev, { ...mapping, user: member?.user }]);
      } catch (err: any) {
        toast.error(err.message || "Failed to assign user");
      }finally{
        setLoading(false);
      }
  };

    const handleUnassign = async (assignUserId: number) => {
      if (!issue) return;
      setLoading(true);
      try {
        await unassignUser(issue.id, assignUserId);
        setAssignees((prev) => prev.filter((a) => Number(a.userId) !== Number(assignUserId)));
      } catch (err: any) {
        toast.error(err.message || "Failed to unassign user");
      }finally{
        setLoading(false);
      }
    };
    
    if (!issue) return null;

    return(
    <div className="page-container page-container--narrow issue-page">
      <ToastContainer position="top-right" autoClose={4000} />
      <button className="issue-back" onClick={() => navigate(-1)}>← Back to board</button>
      <input
        className="issue-title-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleTitleBlur}
      />

      <div className="issue-block-label">Assignees</div>
      <div className="issue-assignees">
        {assignees.map((a) => (
          <div key={a.userId} className="issue-assignee-chip">
            <div
              className="issue-assignee-avatar"
              style={{ background: getAvatarColor(a.user?.username || "?") }}
            >
              {(a.user?.username || "?").slice(0, 2)}
            </div>
            <span>{a.user?.username}</span>
            <button onClick={() => handleUnassign(a.userId)}>×</button>
          </div>
        ))}

        {availableMembers.length > 0 && (
          <select
            className="issue-assignee-select"
            value=""
            onChange={(e) => e.target.value && handleAssign(Number(e.target.value))}
          >
            <option value="">+ Assign member</option>
            {availableMembers.map((m) => (
              <option key={m.userId} value={m.userId}>
                {m.user.username}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="issue-block-label">Description</div>
      {editingDesc ? (
        <>
          <textarea
            className="issue-description"
            value={description}
            autoFocus
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleDescriptionSave}
          />
        </>
      ) : (
        <div className="issue-description-placeholder" onClick={() => setEditingDesc(true)}>
          {description || "Add a more detailed description..."}
        </div>
      )}

      <div className="issue-block-label">Comments</div>

      <div className="issue-comment-list">
        {comments.map((comment) => (
          <div key={comment.id} className="issue-comment">
            <div
              className="issue-comment-avatar"
              style={{ background: getAvatarColor(comment.user?.username || "?") }}
            >
              {(comment.user?.username || "?").slice(0, 2)}
            </div>
            <div className="issue-comment-body">
              <div className="issue-comment-author">{comment.user?.username || "Unknown"}</div>
              
              {editCommentId===comment?.id?(
                <>
                <textarea
                  className="issue-comment-edit-input"
                  value={editContent}
                  autoFocus
                  onChange={(e)=>setEditContent(e.target.value)}
                  />
                  <div className="issue-comment-actions">
                    <button onClick={()=>handleUpdateComment(comment.id)}>Save</button>
                    <button onClick={()=>setEditCommentId(null)}>Cancel</button>
                  </div>
                </>
              ):(
                <>
                  <div className="issue-comment-text">{comment.content}</div>
                  {(comment?.user?.username===(user as unknown as string)||comment.userId === user?.id) && (
                    <div className="issue-comment-actions">
                      <button
                        onClick={() => {
                          setEditCommentId(comment.id);
                          setEditContent(comment.content as string);
                        }}>Edit</button>
                      <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="issue-comment-form">
        <textarea
          rows={2}
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          className="issue-comment-submit"
          disabled={!newComment.trim() || postingComment}
          onClick={handleAddComment}
        >
          {postingComment ? "Posting..." : "Comment"}
        </button>
      </div>

      <div className="issue-danger-zone">
        <button className="issue-delete-btn" onClick={handleDeleteIssue}>
          Delete issue
        </button>
      </div>
    </div>
    )
}