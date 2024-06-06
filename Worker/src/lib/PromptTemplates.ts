import { ChatPromptTemplate } from "@langchain/core/prompts";
import { MessagesPlaceholder } from "@langchain/core/prompts";

export const systemPrompt =
  ChatPromptTemplate.fromTemplate(`Answer the following question based only on the provided context:
    <context>
    {context}
    </context>

    Question: {input}`
);


export const historyAwarePrompt = ChatPromptTemplate.fromMessages([
  new MessagesPlaceholder("chat_history"),
  ["user", "{input}"],
  [
    "user",
    "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation",
  ],
]);

export const historyAwareRetrievalPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "Answer the user's questions based on the below context:\n\n{context}. NOTE:First Point = When someone ask about the pdf or this pdf or uploaded pdf or related questions -> give him summary about the pdf. Second point = only answer what is required, up to the mark. If you don't know an answer, say :Sorry I am trained on the PDF you uploaded, I don't know the answer to your question.  ",
  ],
  new MessagesPlaceholder("chat_history"),
  ["user", "{input}"],
]);
