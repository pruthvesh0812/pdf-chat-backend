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
exports.getConversationalRetrievalChain = exports.getRetrievalChain = void 0;
const combine_documents_1 = require("langchain/chains/combine_documents");
const PromptTemplates_1 = require("./PromptTemplates");
const InitOpenAi_1 = require("./InitOpenAi");
const retrieval_1 = require("langchain/chains/retrieval");
const getVectorStore_1 = require("./getVectorStore");
const history_aware_retriever_1 = require("langchain/chains/history_aware_retriever");
const getRetrievalChain = (client, userId, pdfId) => __awaiter(void 0, void 0, void 0, function* () {
    const documentChain = yield (0, combine_documents_1.createStuffDocumentsChain)({
        llm: InitOpenAi_1.chatModel,
        prompt: PromptTemplates_1.systemPrompt,
    });
    const existingVectorStore = yield (0, getVectorStore_1.getVectorStore)(client, userId, pdfId);
    const retriever = existingVectorStore.asRetriever();
    const retrievalChain = yield (0, retrieval_1.createRetrievalChain)({
        combineDocsChain: documentChain,
        retriever,
    });
    return retrievalChain;
});
exports.getRetrievalChain = getRetrievalChain;
const getConversationalRetrievalChain = (client, userId, pdfId) => __awaiter(void 0, void 0, void 0, function* () {
    const historyAwareCombineDocsChain = yield (0, combine_documents_1.createStuffDocumentsChain)({
        llm: InitOpenAi_1.chatModel,
        prompt: PromptTemplates_1.historyAwareRetrievalPrompt,
    });
    const existingVectorStore = yield (0, getVectorStore_1.getVectorStore)(client, userId, pdfId);
    const retriever = existingVectorStore.asRetriever();
    const historyAwareRetrieverChain = yield (0, history_aware_retriever_1.createHistoryAwareRetriever)({
        llm: InitOpenAi_1.chatModel,
        retriever,
        rephrasePrompt: PromptTemplates_1.historyAwarePrompt,
    });
    const conversationalRetrievalChain = yield (0, retrieval_1.createRetrievalChain)({
        retriever: historyAwareRetrieverChain,
        combineDocsChain: historyAwareCombineDocsChain,
    });
    return conversationalRetrievalChain;
});
exports.getConversationalRetrievalChain = getConversationalRetrievalChain;
