"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    userId: String,
    email: String,
    password: String,
    pdfId: [String]
});
exports.users = mongoose_1.default.models.USERS || mongoose_1.default.model("USERS", userSchema);
