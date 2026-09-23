import {useState,useEffect} from "react"
import {useParams,useNavigate} from "react-router"
import {updateIssue,getIssue,deleteIssue} from "../api/issue"
import {createComment,updateComment,deleteComment} from "../api/comment"
import { getAvatarColor } from "../utils/avatarColor"
import {useAuth} from "../context/AuthContext"
import type {Issue,Comment} from "../types"
import { MessageBox } from "../components/MessageBox"
import "../styles/issue.css"

export default function IssueDetailPage(){
    const {issueId}=useParams();
    const id=Number(issueId);
    const navigate=useNavigate();
    const {user}=useAuth();

    const [issue,setIssue]=useState<Issue>();
    const [comments,setComments]=useState<Comment[]>([]);
    const [loading,setLoading]=useState(true);

    const [title,setTitle]=useState("");
    const [description,setDescription]=useState("");
    const [editingDesc,setEditingDesc]=useState(false);
    const [editCommentId,setEditCommentId]=useState<number|null>(null);
    const [editContent,setEditContent]=useState("");

    const [newComment,setNewComment]=useState("");
    const [postingComment,setPostingComment]=useState(false);

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
        }catch(err:any){
            MessageBox({title:"Error",message:err.message,type:"error"});
        }finally{
            setLoading(false);
        }
    }

    const handleTitleBlur=async()=>{
        if(!issue||title.trim()===issue.title)return;
        try{
            const update=await updateIssue(issue.id,title.trim(),description);
            setIssue(update);
        }catch(err:any){        
            MessageBox({title:"Error",message:err.message,type:"error"});
        }
    }

    const handleDescriptionSave=async()=>{
        try{
            const updated=await updateIssue(Number(issue?.id),title,description);
            setIssue(updated);
            setEditingDesc(false);
        }catch(err:any){
            MessageBox({title:"Error",message:err.message,type:"error"});
        }
    }

    const handleAddComment=async()=>{
        if(!newComment.trim()||!issue)return;
        setPostingComment(true);
        try {
            const comment=await createComment(issue.id,newComment);
            const formattedComment:any={
               user:{
                   username:user
               }
            };
            setComments((prev) => [...prev, { ...comment, ...formattedComment }]);
            setNewComment("");
        } catch (err:any) {
            MessageBox({title:"Error",message:err.message,type:"error"});
        }finally{
            setPostingComment(false);
        }
    }

    const handleUpdateComment=async(commentId:number)=>{
      if(!editContent.trim())return;
      try{
        const updated=await updateComment(commentId,editContent.trim());
        const formattedComment:any={
          user:{
            username:user
          }
        };
        setComments((prev)=>prev.map((comment:any)=>comment.id===commentId?{...updated,...formattedComment}:comment));
        setEditCommentId(null);
      }catch(err:any){
        MessageBox({title:"Error",message:err.message,type:"error"});
      }
    }

    const handleDeleteComment=async(commentId:number)=>{
        try{
            await deleteComment(commentId);
            setComments((prev)=>prev.filter((comment)=>comment.id!==commentId));
        }catch(err:any){
            MessageBox({title:"Error",message:err.message,type:"error"});
        }
    }

    const handleDeleteIssue=async()=>{
      if(!issue)return;
      MessageBox({
        title: "Delete Issue",
        message: "Are you sure you want to delete this issue?",
        type: "confirm",
        onConfirm: async () => {
          try {
              await deleteIssue(Number(issueId));
              setIssue((prev:any)=>prev.filter((issue:any)=>issue.id!==Number(issueId)));
              MessageBox({
                title: "Success",
                message: "Issue deleted successfully",
                type: "success"
              });
              navigate(-1);
            } catch (err: any) {
                MessageBox({
                  title: "Error",
                  message: err.message || "Failed to delete issue",
                  type: "error"
                });
              }
            }
        });
    }

    if(loading) return <div className="board-loading">Loading issue...</div>;
     if (!issue) return null;

    return(
    <div className="issue-page">
      <button className="issue-back" onClick={() => navigate(-1)}>← Back to board</button>
      <input
        className="issue-title-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleTitleBlur}
      />

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