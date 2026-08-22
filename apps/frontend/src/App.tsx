import {useState, useEffect } from 'react'
import './App.css'

import {Routes,Route,BrowserRouter, useParams} from "react-router"

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/board/:boardId" element={<Board/>}/>
          
        </Routes>
      </BrowserRouter>
    </div>
  )
}

function Board(){
  const {boardId} =useParams();
  const [users,setUsers]=useState([]);
  useEffect(() => {
    const ws=new WebSocket("ws://localhost:8080");
    ws.onmessage=(ev)=>{
      const data=JSON.parse(ev.data);
      console.log(data);
      if(data.type==="initial_state"){
        setUsers(data.users); 
      }
      if(data.type==="join"){
        setUsers(u=>[...u,{id:data.userId}]);
      }
      if(data.type==="leave"){
        setUsers(u=>u.filter((user:any)=>user.id!==data.userId));
      }
    }
    ws.onopen=()=>{
      ws.send(JSON.stringify({type:"join",boardId:boardId}));
    }
    
  },[])
  return <div>
    You are on Board {boardId} 
    Current Active Users -{JSON.stringify(users)}
  </div>
}

export default App
