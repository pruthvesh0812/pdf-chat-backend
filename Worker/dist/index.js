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
const redisConfig_1 = require("./redisConfig");
(0, redisConfig_1.redisConnect)();
function generateAiResponse(question) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("this is ai response:", question);
        yield redisConfig_1.client.publish("AiResponsePubSub", JSON.stringify(Object.assign(Object.assign({}, question), { ans: "this is my answer Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum" })));
    });
}
function startWorker() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            while (true) {
                try {
                    const question = yield redisConfig_1.client.brPop("Questions", 0);
                    yield generateAiResponse(question);
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
