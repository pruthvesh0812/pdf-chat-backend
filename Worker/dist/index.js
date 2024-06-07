"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const PineconeClient_1 = require("./lib/PineconeClient");
const RetrievalChain_1 = require("./lib/RetrievalChain");
const redisConfig_1 = require("./redisConfig");
const messages_1 = require("@langchain/core/messages");
(0, redisConfig_1.redisConnect)();
function generateAiResponse({ userId, pdfId, question, messages }) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("this is ai response:", question);
        const chatHistory = messages.map(message => {
            if (message.type == "AI") {
                return new messages_1.AIMessage(message.text);
            }
            else {
                return new messages_1.HumanMessage(message.text);
            }
        });
        try {
            const pineconeClient = yield (0, PineconeClient_1.getPineconeClient)();
            const conversationalRetrievalChain = yield (0, RetrievalChain_1.getConversationalRetrievalChain)(pineconeClient, userId, pdfId);
            const result = yield conversationalRetrievalChain.invoke({
                chat_history: chatHistory,
                input: question,
            });
            console.log(result, "result");
            yield redisConfig_1.client.publish(`${pdfId}`, JSON.stringify({ result: result.answer }));
        }
        catch (err) {
            console.log("Error while connecting to openAi", err);
        }
    });
}
function startWorker() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            while (true) {
                try {
                    const userRequest = yield redisConfig_1.client.brPop("Questions", 0);
                    yield generateAiResponse(JSON.parse(userRequest === null || userRequest === void 0 ? void 0 : userRequest.element));
                }
                catch (err) {
                    console.log("error process request", err);
                }
            }
        }
        catch (err) {
            console.log("internal server error:", err);
        }
    });
}
startWorker();
