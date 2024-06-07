import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";

import { connectMongoDb } from "../models/mongoDbClient";
import { pdfs } from "../models/Pdf";

let NAMESPACE: string = ""
let PDFID: string = ""

import dotenv from 'dotenv'
dotenv.config()

export async function getVectorStore(client: Pinecone, userId: string, pdfId: string) {
  
        const embeddings = new OpenAIEmbeddings();
        console.log(process.env.PINECONE_INDEX_NAME,"index")
        const index = client.Index("pdf-chat-index-1")
        connectMongoDb()
        try {
            // for first question
          
            if (NAMESPACE.length == 0) {
                const userPdfNamespace = await pdfs.findOne({  pdfId,userId })
                
                NAMESPACE = userPdfNamespace?.namespace as string
            }
            else if (PDFID != pdfId) {
                const userPdfNamespace = await pdfs.findOne({  pdfId ,userId})
              

                NAMESPACE = userPdfNamespace?.namespace as string
            }
         
    
            const existingVectorStore = await PineconeStore.fromExistingIndex(
                embeddings,
                {
                    pineconeIndex: index,
                    textKey: 'text',
                    namespace: NAMESPACE
                }
            )
            
            return existingVectorStore;
        }
        catch (err) {
            throw new Error("Error while getting existing vector store")
        }
}