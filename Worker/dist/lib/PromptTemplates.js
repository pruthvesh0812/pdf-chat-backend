"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.historyAwareRetrievalPrompt = exports.historyAwarePrompt = exports.systemPrompt = void 0;
const prompts_1 = require("@langchain/core/prompts");
const prompts_2 = require("@langchain/core/prompts");
exports.systemPrompt = prompts_1.ChatPromptTemplate.fromTemplate(`Answer the following question based only on the provided context:
    <context>
    {context}
    </context>

    Question: {input}`);
exports.historyAwarePrompt = prompts_1.ChatPromptTemplate.fromMessages([
    new prompts_2.MessagesPlaceholder("chat_history"),
    ["user", "{input}"],
    [
        "user",
        "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation",
    ],
]);
exports.historyAwareRetrievalPrompt = prompts_1.ChatPromptTemplate.fromMessages([
    [
        "system",
        "Answer the user's questions based on the below context:\n\n{context}. NOTE:First Point = When someone ask about the pdf or this pdf or uploaded pdf or related questions -> give him summary about the pdf. Second point = only answer what is required, up to the mark. If you don't know an answer, say :Sorry I am trained on the PDF you uploaded, I don't know the answer to your question.  ",
    ],
    new prompts_2.MessagesPlaceholder("chat_history"),
    ["user", "{input}"],
]);
