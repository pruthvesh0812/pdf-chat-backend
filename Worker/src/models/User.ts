import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    userId:String,
    email:String,
    password:String,
    pdfId:[String]
})


export const users = mongoose.models.USERS || mongoose.model("USERS",userSchema)

