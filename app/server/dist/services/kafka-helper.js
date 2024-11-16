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
exports.consumeMessages = exports.produceMessage = void 0;
const kafka_config_1 = require("../config/kafka.config");
const produceMessage = (topic, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield kafka_config_1.producer.send({
            topic,
            messages: [{ value: JSON.stringify(data) }],
        });
        // console.log(`Message produced to topic ${topic}:`, data);
    }
    catch (error) {
        console.error(`Error producing message to topic ${topic}:`, error);
    }
});
exports.produceMessage = produceMessage;
const consumeMessages = (topic) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield kafka_config_1.consumer.connect();
        yield kafka_config_1.consumer.subscribe({ topic, fromBeginning: true });
        yield kafka_config_1.consumer.run({
            eachMessage: (_a) => __awaiter(void 0, [_a], void 0, function* ({ topic, partition, message }) {
                var _b;
                const parsedData = JSON.parse((_b = message.value) === null || _b === void 0 ? void 0 : _b.toString());
                try {
                    const response = yield fetch(`http://localhost:3000/api/messages/${parsedData.chatId}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" }, // Specify content type
                        body: JSON.stringify(parsedData),
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const result = yield response.json();
                    console.log("API Response: Message Saved to database! ", result.success);
                }
                catch (error) {
                    console.error("Error processing message:", error);
                }
            }),
        });
    }
    catch (error) {
        console.error(`Error consuming messages from topic ${topic}:`, error);
    }
});
exports.consumeMessages = consumeMessages;
