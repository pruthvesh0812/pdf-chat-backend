"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatModel = void 0;
const openai_1 = require("@langchain/openai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const openAIApiKey = process.env.OPENAI_API_KEY;
exports.chatModel = new openai_1.ChatOpenAI({ openAIApiKey });
