
import { getPineconeClient } from './lib/PineconeClient';
import { getConversationalRetrievalChain } from './lib/RetrievalChain';
import { client, redisConnect } from './redisConfig';
import { HumanMessage, AIMessage } from "@langchain/core/messages";

redisConnect();

export type messageType = {
    type:string,
    text:string,
    timestamp:number,
}

async function generateAiResponse({ userId, pdfId, question, messages}:{userId:string,pdfId:string,question:string,messages: messageType[]}) {
    console.log("this is ai response:", question)

    const chatHistory = messages.map(message => {
        if (message.type == "AI") {
          return new AIMessage(message.text)
        }
        else {
          return new HumanMessage(message.text)
        }
      })

    try{

        const pineconeClient = await getPineconeClient()
        const conversationalRetrievalChain = await getConversationalRetrievalChain(pineconeClient, userId, pdfId)
        const result = await conversationalRetrievalChain.invoke({
          chat_history: chatHistory,
          input: question,
        });
        console.log(result,"result")
        await client.publish(`${pdfId}`, JSON.stringify({result:result.answer}))
    }
    catch(err){
        console.log("Error while connecting to openAi", err)
    }
}

async function startWorker(){
    try{
        while(true){
            try{
                const userRequest = await client.brPop("Questions",0);
                await generateAiResponse(JSON.parse(userRequest?.element!))
            }
            catch(err){
                console.log("error process request", err)
            }
        }
    }
    catch(err){
        console.log("internal server error:",err)
    }
}

startWorker();