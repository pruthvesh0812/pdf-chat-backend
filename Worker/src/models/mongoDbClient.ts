import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
let IS_CONNECTED:boolean = false;

export const connectMongoDb = async () =>{
    if(!IS_CONNECTED){
        mongoose.connect(process.env.DB_URL!,{dbName:"pdf-chat-ai-db"}).then(res=>{
            console.log("db connected")
            IS_CONNECTED = true;
        }).catch(err=>{
            console.log("error while connecting db")
        })
    }
    
        
}