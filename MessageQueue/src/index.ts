import express, { Request, Response } from 'express'
import cors from 'cors'
import { MQClient, redisConnect,PUBSUBClient } from './redisConfig';

const app = express();
app.use(express.json());

const PORT = 5001;

app.get("/chat/:chatId",async (req:Request,res:Response)=>{
    const {chatId} = req.params;
    console.log(chatId," => chatId")
    console.log("inside get")
    try{
     
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          });

         PUBSUBClient.SUBSCRIBE("AiResponsePubSub",(message:string,channel:string)=>{
            console.log(message,"message from ai",channel)
            // server sent event - unidirectional persistent connection
              // Send the event
            res.write('data: ' + JSON.stringify(message) + '\n\n');
            // client.QUIT()
            // res.end(); // this is to close the sse connection   
        })
        // store to db
        // res.status(200).json({message:"response pending"})

       
    }
    catch(err){
        console.error("Redis error:", err);
        res.status(500).send("Failed generate response");
    }
})

app.post("/chat/:chatId",async (req:Request,res:Response)=>{
    const {chatId} = req.params;
    console.log(chatId," => chatId")
    try{
        // message queue
        await MQClient.lPush("Questions", JSON.stringify({chatId}))

      
        // store to db
        res.status(200).json({message:"response pending"})

       
    }
    catch(err){
        console.error("Redis error:", err);
        res.status(500).send("Failed generate response");
    }
})

redisConnect();

app.listen(PORT,()=>{
    console.log("server running on port:",PORT)
})