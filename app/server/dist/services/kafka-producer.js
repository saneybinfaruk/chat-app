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
exports.createProducer = void 0;
const kafkajs_1 = require("kafkajs");
// Create a Kafka producer
const createProducer = () => __awaiter(void 0, void 0, void 0, function* () {
    const kafka = new kafkajs_1.Kafka({
        clientId: "my-app",
        brokers: ["localhost:9092"], // Update with your Kafka broker address
    });
    const producer = kafka.producer();
    yield producer.connect();
    console.log("Kafka Producer connected!");
    return producer;
});
exports.createProducer = createProducer;
