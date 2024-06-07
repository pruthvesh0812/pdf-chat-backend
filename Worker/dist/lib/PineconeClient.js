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
exports.getPineconeClient = void 0;
const pinecone_1 = require("@pinecone-database/pinecone");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let isIndexCreated = false;
const pc = new pinecone_1.Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});
const createPineConeIndex = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield pc.createIndex({
            name: process.env.PINECONE_INDEX_NAME,
            dimension: 1536,
            metric: 'cosine',
            spec: {
                serverless: {
                    cloud: 'aws',
                    region: 'us-east-1'
                }
            }
        });
        console.log("index created");
    }
    catch (err) {
        throw new Error("Index Creation Failed");
    }
});
const getPineconeClient = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const currentIndexes = yield pc.listIndexes();
            (_a = currentIndexes.indexes) === null || _a === void 0 ? void 0 : _a.forEach(indexModal => {
                if (indexModal.name == process.env.PINECONE_INDEX_NAME) {
                    isIndexCreated = true;
                    console.log("pinecone exists");
                }
            });
            if (!isIndexCreated) {
                yield createPineConeIndex();
            }
            resolve(pc);
        }
        catch (err) {
            reject(err);
        }
    }));
});
exports.getPineconeClient = getPineconeClient;
