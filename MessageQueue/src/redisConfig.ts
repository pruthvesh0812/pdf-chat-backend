import { createClient } from "redis";

export const MQClient = createClient();
export const PUBSUBClient = createClient();

export const redisConnect = async () => {
    try{
        await MQClient.connect();
        await PUBSUBClient.connect();
        console.log("redis connected");
    }
    catch(err){
        console.log("connection failed, error: ", err);
    }
}

