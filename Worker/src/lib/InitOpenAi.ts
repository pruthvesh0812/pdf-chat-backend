import { ChatOpenAI } from "@langchain/openai";
import dotenv from 'dotenv'
dotenv.config()

const openAIApiKey = process.env.OPENAI_API_KEY;
export const chatModel = new ChatOpenAI({openAIApiKey});