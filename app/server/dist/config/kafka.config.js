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
exports.connectKafkaProducer = exports.consumer = exports.producer = void 0;
const kafkajs_1 = require("kafkajs");
const kafka = new kafkajs_1.Kafka({
    brokers: ["192.168.0.100:9092"],
    clientId: "hokage-hub",
    logLevel: kafkajs_1.logLevel.ERROR,
});
exports.default = kafka;
exports.producer = kafka.producer();
exports.consumer = kafka.consumer({
    groupId: "hokage-hub",
});
const connectKafkaProducer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.producer.connect();
    console.log("The Kafka producer connected...");
});
exports.connectKafkaProducer = connectKafkaProducer;
