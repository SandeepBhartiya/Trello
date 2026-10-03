import {useEffect, useState} from "react";
import {useNavigate,useParams} from "react-router";
import { useLoading } from "../context/LoadingContext";
import {getBoards,deleteBoards} from "../api/board";
import {MessageBox} from "../components/MessageBox";
import CreateBoardModal from "../components/CreateBoardModal";
import RenameBoardModal from "../components/RenameBoardModal";
import type { Board } from "../types";
import "../styles/board.css";

export default function BoardListPage(){
    const {orgId}=useParams();
    const organizationId=Number(orgId);
    const [boards,setBoards]=useState<Board[]>([]);
    const [selectedBoard,setSelectedBoard]=useState<Board|null>(null);
    const {loading,setLoading}=useLoading();
    const [showCreateModal,setShowCreateModal]=useState(false);
    const [showRenameModal,setShowRenameModal]=useState(false);
    const [userRole,setUserRole]=useState("");

    const navigate=useNavigate();

    useEffect(()=>{
        loadBoards();
    },[organizationId]);

    const loadBoards=async()=>{
        setLoading(true);
        try{
          const data:any=await getBoards(organizationId);
          setBoards(data?.boards??[]);
          setUserRole(data?.role);
        }catch(err){
          console.log(err);
        }finally{
          setLoading(false);
        }
    };
    
    const handleBoardClick=(boardId:number)=>{
      navigate(`/organizations/${organizationId}/boards/${boardId}/lists`);
    }

    const handelDeleteBoard=async(boardId:number)=>{
      MessageBox({
        title: "Delete board",
        message: "Are you sure you want to delete this board?",
        type: "confirm",
        onConfirm: async () => {
          setLoading(true);
          try {
            await deleteBoards(boardId);
            MessageBox({
              title: "Success",
              message: "Board deleted successfully",
              type: "success"
            });
            await loadBoards();
          } catch (err: any) {
            MessageBox({
              title: "Error",
              message: err.message || "Failed to delete board",
              type: "error"
            });
          }finally{
            setLoading(false);
          }
        }
      });
    }

    return(
      <div className="page-container">
        {boards.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-title">No boards yet</div>
            <div className="empty-state-subtitle">
              Create a board to start organizing work into sections and issues.
            </div>
            <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
              + New board
            </button>
          </div>
        ) : (
          <div className="card-grid">
            {boards.map((board) => (
              <div key={board.id} className="board-card" onClick={() => handleBoardClick(board.id)}>
                <div className="board-card-title">{board.title}</div>
                <div className="board-card-edit" onClick={(e)=>{e.stopPropagation();setSelectedBoard(board);setShowRenameModal(true);}}>✏️</div>
                {userRole==="admin" && (
                  <div className="board-card-delete" onClick={(e)=>{e.stopPropagation();handelDeleteBoard(board.id)}}>🗑️</div>
                )}
              </div>
            ))}

            <div className="board-card board-card-new" onClick={() => setShowCreateModal(true)}>
              + Create new board
            </div>
          </div>
        )}

        {showCreateModal && (
          <CreateBoardModal
            organizationId={organizationId}
            onClose={() => setShowCreateModal(false)}
            onCreated={(newBoard) => setBoards((prev) => [...prev, newBoard])}
          />
        )}
        {showRenameModal && (
          <RenameBoardModal
            board={selectedBoard!}
            onClose={() => {setShowRenameModal(false);setSelectedBoard(null);}}
            onUpdated={(updatedBoard) => {
              setBoards((prev) =>
                prev.map((b) => (b.id === updatedBoard.id ? updatedBoard : b))
              );
              setShowRenameModal(false);
              setSelectedBoard(null);
            }}
          />  
        )}
    </div>
  );
}
