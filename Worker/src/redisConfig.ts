import { createClient } from "redis";

export const client = createClient();

export const redisConnect = async () => {
    try{
        await client.connect();
        console.log("redis connected");
    }
    catch(err){
        console.log("connection failed, error: ", err);
    }
}

