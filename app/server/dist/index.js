"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const socket_1 = __importDefault(require("./services/socket"));
const kafka_config_1 = require("./config/kafka.config");
const kafka_helper_1 = require("./services/kafka-helper");
const events_1 = require("./constants/events");
const socketService = new socket_1.default();
const httpServer = (0, http_1.createServer)();
const PORT = process.env.PORT ? process.env.PORT : 8000;
socketService.io.attach(httpServer);
(0, kafka_config_1.connectKafkaProducer)().catch((error) => console.log("The Kafka connect error ", error));
(0, kafka_helper_1.consumeMessages)(events_1.INCOMMING_MESSAGE).catch((error) => {
    console.log("The Kafka Consume Message error ", error);
});
httpServer.listen(PORT, () => {
    console.log("HTTP server listing ar port " + PORT);
});
socketService.initListeners();
