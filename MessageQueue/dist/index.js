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
const express_1 = __importDefault(require("express"));
const redisConfig_1 = require("./redisConfig");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = 5001;
app.get("/chat/:chatId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId } = req.params;
    console.log(chatId, " => chatId");
    console.log("inside get")

    try {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        });
        redisConfig_1.PUBSUBClient.SUBSCRIBE("AiResponsePubSub", (message, channel) => {
            console.log(message, "message from ai", channel);
            // server sent event - unidirectional persistent connection
            // Send the event
            res.write('data: ' + JSON.stringify(message) + '\n\n');
            // client.QUIT()
            // res.end(); // this is to close the sse connection   
        });
        // store to db
        // res.status(200).json({message:"response pending"})
    }
    catch (err) {
        console.error("Redis error:", err);
        res.status(500).send("Failed generate response");
    }
}));
app.post("/chat/:chatId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId } = req.params;
    console.log(chatId, " => chatId");
    try {
        // message queue
        yield redisConfig_1.MQClient.lPush("Questions", JSON.stringify({ chatId }));
        // store to db
        res.status(200).json({ message: "response pending" });
    }
    catch (err) {
        console.error("Redis error:", err);
        res.status(500).send("Failed generate response");
    }
}));
(0, redisConfig_1.redisConnect)();
app.listen(PORT, () => {
    console.log("server running on port:", PORT);
});
