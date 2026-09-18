import {useEffect, useState} from "react";
import {useNavigate,useParams} from "react-router";
import {getBoards,updateBoard} from "../api/board";
import {MessageBox} from "../components/MessageBox";
import CreateBoardModal from "../components/CreateBoardModal";
import type { Board } from "../types";
import "../styles/board.css";

export default function BoardListPage(){
    const {orgId}=useParams();
    const organizationId=Number(orgId);
    const [boards,setBoards]=useState<Board[]>([]);
    const [loading,setLoading]=useState(true);
    const [showCreateModal,setShowCreateModal]=useState(false);
    
    const navigate=useNavigate();

    useEffect(()=>{
        loadBoards();
    },[organizationId]);

    const loadBoards=async()=>{
        setLoading(true);
        try{
            console.log("organizationId",organizationId);
            const data:any=await getBoards(organizationId);
            setBoards(data??[]);
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    };
    
    const handleBoardClick=(boardId:number)=>{
        navigate(`/organizations/${organizationId}/boards/${boardId}/lists`);
    }

    if(loading){
        return <div className="board-loading">Loading...</div>;
    }

    // if(error){}

    return(
        // <div className="board-page">
        //     <div className="board-page-header">

        //     </div>
        // </div>
         <div className="board-page">
      <div className="board-page-header">
        <h1>Boards</h1>
        {boards.length > 0 && (
          <button className="org-create-btn" onClick={() => setShowCreateModal(true)}>
            + New board
          </button>
        )}
      </div>

      {boards.length === 0 ? (
        <div className="board-empty-wrap">
          <div className="board-empty-icon">📋</div>
          <div className="board-empty-title">No boards yet</div>
          <div className="board-empty-subtitle">
            Create a board to start organizing work into sections and issues.
          </div>
          <button className="org-create-btn" onClick={() => setShowCreateModal(true)}>
            + New board
          </button>
        </div>
      ) : (
        <div className="board-list">
          {boards.map((board) => (
            <div key={board.id} className="board-card" onClick={() => handleBoardClick(board.id)}>
              <div className="board-card-title">{board.title}</div>
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
    </div>
    );
}
