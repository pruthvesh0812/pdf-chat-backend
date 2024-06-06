import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { historyAwarePrompt, historyAwareRetrievalPrompt, systemPrompt } from "./PromptTemplates";
import { chatModel } from "./InitOpenAi";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { getVectorStore } from "./getVectorStore";
import { Pinecone } from "@pinecone-database/pinecone";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";

export const getRetrievalChain = async (client:Pinecone,userId:string,pdfId:string) =>{
    const documentChain = await createStuffDocumentsChain({
        llm: chatModel,
        prompt:systemPrompt,
        });
    
    const existingVectorStore = await getVectorStore(client,userId,pdfId);
    const retriever = existingVectorStore.asRetriever();

    const retrievalChain = await createRetrievalChain({
        combineDocsChain: documentChain,
        retriever,
      });
    return retrievalChain
}

export const getConversationalRetrievalChain = async (client:Pinecone,userId:string,pdfId:string) =>{
    const historyAwareCombineDocsChain = await createStuffDocumentsChain({
        llm: chatModel,
        prompt: historyAwareRetrievalPrompt,
      });

    const existingVectorStore = await getVectorStore(client,userId,pdfId);
    const retriever = existingVectorStore.asRetriever();

    const historyAwareRetrieverChain = await createHistoryAwareRetriever({
        llm: chatModel,
        retriever,
        rephrasePrompt: historyAwarePrompt,
      });

    const conversationalRetrievalChain = await createRetrievalChain({
        retriever: historyAwareRetrieverChain,
        combineDocsChain: historyAwareCombineDocsChain,
      });

    return conversationalRetrievalChain
}

