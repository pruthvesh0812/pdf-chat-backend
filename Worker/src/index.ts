
import { client, redisConnect } from './redisConfig';

redisConnect();

async function generateAiResponse(question:any) {
    console.log("this is ai response:", question)
    await client.publish("AiResponsePubSub", JSON.stringify({...question,...{ans:"this is my answer Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"}}))
}

async function startWorker(){
    try{
        while(true){
            try{
                const question = await client.brPop("Questions",0);
                await generateAiResponse(question)
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