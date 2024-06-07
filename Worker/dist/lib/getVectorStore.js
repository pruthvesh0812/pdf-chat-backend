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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVectorStore = void 0;
const pinecone_1 = require("@langchain/pinecone");
const openai_1 = require("@langchain/openai");
const mongoDbClient_1 = require("../models/mongoDbClient");
const Pdf_1 = require("../models/Pdf");
let NAMESPACE = "";
let PDFID = "";
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function getVectorStore(client, userId, pdfId) {
    return __awaiter(this, void 0, void 0, function* () {
        const embeddings = new openai_1.OpenAIEmbeddings();
        console.log(process.env.PINECONE_INDEX_NAME, "index");
        const index = client.Index("pdf-chat-index-1");
        (0, mongoDbClient_1.connectMongoDb)();
        try {
            // for first question
            if (NAMESPACE.length == 0) {
                const userPdfNamespace = yield Pdf_1.pdfs.findOne({ pdfId, userId });
                NAMESPACE = userPdfNamespace === null || userPdfNamespace === void 0 ? void 0 : userPdfNamespace.namespace;
            }
            else if (PDFID != pdfId) {
                const userPdfNamespace = yield Pdf_1.pdfs.findOne({ pdfId, userId });
                NAMESPACE = userPdfNamespace === null || userPdfNamespace === void 0 ? void 0 : userPdfNamespace.namespace;
            }
            const existingVectorStore = yield pinecone_1.PineconeStore.fromExistingIndex(embeddings, {
                pineconeIndex: index,
                textKey: 'text',
                namespace: NAMESPACE
            });
            return existingVectorStore;
        }
        catch (err) {
            throw new Error("Error while getting existing vector store");
        }
    });
}
exports.getVectorStore = getVectorStore;
