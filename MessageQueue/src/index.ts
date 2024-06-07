import express, { Request, Response } from 'express'
import cors from 'cors'
import {  redisConnect,PUBSUBClient } from './redisConfig';

const app = express();
app.use(express.json());
app.use(cors({
    origin:"*"
}));
const PORT = 5001;

app.get("/chat/:chatId",async (req:Request,res:Response)=>{
    const {chatId} = req.params;
    console.log(chatId," => chatId")
    console.log("inside get")
    try{
        // server sent event - unidirectional persistent connection
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          });

         PUBSUBClient.SUBSCRIBE(`${chatId}`,(message:string,channel:string)=>{
            console.log(message,"message from ai",channel)
              // Send the event
            res.write(JSON.stringify(message));
            // res.end(); // this is to close the sse connection   
        })      
    }
    catch(err){
        console.error("Redis error:", err);
        res.status(500).send("Failed generate response");
    }
})

// app.post("/chat/:chatId",async (req:Request,res:Response)=>{
//     const {chatId} = req.params;
//     console.log(chatId," => chatId")
//     try{
//         // message queue
//         await MQClient.lPush("Questions", JSON.stringify({chatId}))

      
//         // store to db
//         res.status(200).json({message:"response pending"})

       
//     }
//     catch(err){
//         console.error("Redis error:", err);
//         res.status(500).send("Failed generate response");
//     }
// })

redisConnect();

app.listen(PORT,()=>{
    console.log("server running on port:",PORT)
})