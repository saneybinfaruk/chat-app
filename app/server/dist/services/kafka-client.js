"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
const kafka = new kafkajs_1.Kafka({
    clientId: "hokage-hub",
    brokers: ["192.168.0.102:9092"],
});
exports.default = kafka;
