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
exports.createAdmin = void 0;
const kafka_client_1 = __importDefault(require("./kafka-client"));
const createAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const admin = kafka_client_1.default.admin();
    try {
        console.log("Admin connecting...");
        yield admin.connect();
        console.log("Admin connection successful...");
        const existingTopics = yield admin.listTopics();
        const topicName = "hokage-hub";
        if (existingTopics.includes(topicName)) {
            console.log(`Topic [${topicName}] already exists.`);
        }
        else {
            console.log(`Creating topic [${topicName}]`);
            yield admin.createTopics({
                topics: [
                    {
                        topic: topicName,
                        numPartitions: 2,
                    },
                ],
            });
            console.log(`Topic [${topicName}] created successfully!`);
        }
    }
    catch (error) {
        console.error("Error during Kafka admin operations:", error);
    }
    finally {
        try {
            console.log("Admin disconnecting...");
            yield admin.disconnect();
            console.log("Admin disconnected successfully!");
        }
        catch (disconnectError) {
            console.error("Error disconnecting Kafka admin:", disconnectError);
        }
    }
});
exports.createAdmin = createAdmin;
