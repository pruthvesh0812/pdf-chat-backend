import express, { Request, Response } from 'express'
import cors from 'cors'
import {  redisConnect,PUBSUBClient, MQClient } from './redisConfig';

const app = express();
app.use(express.json());
app.use(cors({
    origin:"*",
    credentials:true
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
        res.flushHeaders();

         PUBSUBClient.SUBSCRIBE(`${chatId}`,(message:string,channel:string)=>{
            console.log(message,"message from ai",channel)
              // Send the event
            res.write(`data:${JSON.stringify(message)}\n\n`); // if you dont put \n\n data wont be send to client
             // this is to close the sse connection   
        })   
        
        res.on("close", ()=>{
            res.end();
        })
    }
    catch(err){
        console.error("Redis error:", err);
        res.status(500).send("Failed generate response");
    }
})

// app.post("/api/:chatId",async (req:Request,res:Response)=>{
//     const {chatId} = req.params;
//     const {question,messages,userId}= req.body
//     console.log(chatId," => chatId")
//     try{
//         // console.log(req.cookies)
//         // const userId = req.cookies
//         // message queue
//         // await MQClient.lPush("Questions", JSON.stringify({chatId}))
//         console.log("here")
//         await MQClient.lPush("Questions", JSON.stringify({ userId, chatId,question,messages}))

      
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