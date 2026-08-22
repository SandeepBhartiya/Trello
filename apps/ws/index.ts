import console = require("node:console");
import {WebSocketServer} from "ws";
// import {prisma} from "db/client";

const server=new WebSocketServer({port:8080});
const ROOMS:any={};

server.on("connection",(socket)=>{
    socket.on("message",(data)=>{
        // console.log("DATA",data);
        const parseData=JSON.parse(data.toString());
        if(parseData.type==="join"){
            const boardId=parseData.boardId;
            console.log("boardId",boardId);
            if(!ROOMS[boardId])
            {
                ROOMS[boardId]=[];
            }

            const newUserId=Math.random();
            ROOMS[boardId].push({UserId:newUserId,socket:socket});
            console.log("ROOMS",ROOMS);
            // ROOMS[boardId].forEach(({socket}) =>socket.send({
            //     socket.send(JSON.stringify({type:"join",users:ROOMS[boardId]}))
            // }));

            for(let i=0;i<ROOMS[boardId].length;i++)
            {
                const user=ROOMS[boardId][i];
                user.socket.send(JSON.stringify({type:"join",userId:newUserId}))
            }

            ROOMS[boardId].push({userid:newUserId,socket:socket});
            console.log("newRoom",ROOMS[boardId]);
            socket.send(JSON.stringify({type:"initial_state",users:ROOMS[boardId].filter((user:any)=>user.userid!=newUserId).map((u:any)=>({id:u.userid}))}));
        }
    })

    socket.on("close",()=>{
        Object.entries(ROOMS).map(([roomId,users])=>{
            const UserExists=users.find((user:any)=>user.socket==socket);
            if(UserExists)
            {
                ROOMS[roomId]=ROOMS[roomId]?.filter((x:any)=>x.socket!=socket);
                users?.forEach(({socket})=>socket.send(JSON.stringify({
                    type:"leave",
                    userId:UserExists.userid
                })))
                // ROOMS[roomId]=users;
            }
        })
    })
})