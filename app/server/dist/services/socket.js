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
const socket_io_1 = require("socket.io");
const events_1 = require("../constants/events");
const redis_streams_adapter_1 = require("@socket.io/redis-streams-adapter");
const redis_config_1 = __importDefault(require("../config/redis.config"));
const kafka_helper_1 = require("./kafka-helper");
class SocketService {
    constructor() {
        console.log("Socket server initialized..!");
        this._io = new socket_io_1.Server({
            cors: {
                allowedHeaders: "*",
                origin: "*",
            },
            adapter: (0, redis_streams_adapter_1.createAdapter)(redis_config_1.default),
        });
    }
    initListeners() {
        const io = this._io;
        console.log("Socket Listeners initialized!");
        const userSockets = new Map();
        io.on("connect", (socket) => {
            console.log("New Socket Connected => ", socket.id);
            socket.on(events_1.USER_REGISTER, ({ userId }) => {
                userSockets.set(userId, socket.id);
            });
            socket.on(events_1.FRIEND_REQUEST, (_a) => __awaiter(this, [_a], void 0, function* ({ senderId, receiverId, message }) {
                console.log(message + " From " + senderId);
            }));
            // socket.on(INCOMMING_MESSAGE, async ({ body, receiverId }) => {
            //   console.log(body);
            //   console.log(
            //     "INCOMMING_MESSAGE ==> " +
            //       body.sender +
            //       " says " +
            //       body.content +
            //       " to " +
            //       receiverId
            //   );
            //   // await produceMessage(INCOMMING_MESSAGE, { body, receiverId });
            //   socket.broadcast.emit(INCOMMING_MESSAGE, receiverId);
            // });
            socket.on(events_1.INCOMMING_MESSAGE, (data) => __awaiter(this, void 0, void 0, function* () {
                const { body, receiverIds } = data;
                console.log("INCOMMING_MESSAGE ==> " +
                    body.sender._id +
                    " says " +
                    body.content +
                    " to " +
                    receiverIds);
                yield (0, kafka_helper_1.produceMessage)(events_1.INCOMMING_MESSAGE, {
                    body,
                    receiverIds,
                });
                receiverIds.forEach((receiverId) => {
                    const receiver = userSockets.get(receiverId);
                    console.log("receiver => ", receiver);
                    socket.to(receiver).emit(events_1.INCOMMING_MESSAGE, body);
                });
            }));
            socket.on(events_1.INCOMMING_MESSAGE_READ, (data) => __awaiter(this, void 0, void 0, function* () {
                const { messageId, chatId, userId } = data;
                console.log(events_1.INCOMMING_MESSAGE_READ, data.messageId);
                try {
                    const response = yield fetch(`http://localhost:3000/api/messages/${chatId}`, {
                        method: "PATCH",
                        body: JSON.stringify({ chatId, messageId, userId }),
                    });
                    const result = yield response.json();
                    console.log("INCOMMING_MESSAGE_READ API Response: ", result);
                    socket.broadcast.emit(events_1.INCOMMING_MESSAGE_READ, data);
                }
                catch (error) { }
            }));
            socket.on("error", (error) => {
                console.log("Socket error:", error);
            });
            socket.on("disconnect", () => {
                for (const [userId, id] of userSockets) {
                    if (id === socket.id) {
                        userSockets.delete(userId);
                        break;
                    }
                }
            });
        });
    }
    get io() {
        return this._io;
    }
}
exports.default = SocketService;
