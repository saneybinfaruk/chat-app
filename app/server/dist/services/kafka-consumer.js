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
exports.createConsumer = void 0;
const kafka_client_1 = __importDefault(require("./kafka-client"));
const createConsumer = () => __awaiter(void 0, void 0, void 0, function* () {
    const consumer = kafka_client_1.default.consumer({
        groupId: "hokage-hub",
    });
    yield consumer.connect();
    yield consumer.subscribe({ topics: ["hokage-hub"], fromBeginning: true });
    yield consumer.run({
        eachMessage: (_a) => __awaiter(void 0, [_a], void 0, function* ({ topic, partition, message, heartbeat, pause }) {
            var _b, _c;
            console.log({
                key: (_b = message.key) === null || _b === void 0 ? void 0 : _b.toString(),
                value: (_c = message.value) === null || _c === void 0 ? void 0 : _c.toString(),
                headers: message.headers,
            });
        }),
    });
});
exports.createConsumer = createConsumer;
