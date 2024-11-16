import { Redis } from "ioredis";
import { Server } from "socket.io";
import {
  FRIEND_REQUEST,
  INCOMMING_MESSAGE,
  INCOMMING_MESSAGE_READ,
  MESSAGE_SAVED,
  USER_REGISTER,
} from "../constants/events";
import { createAdapter } from "@socket.io/redis-streams-adapter";
import redis from "../config/redis.config";
import { instrument } from "@socket.io/admin-ui";
import { produceMessage } from "./kafka-helper";

class SocketService {
  private _io: Server;

  constructor() {
    console.log("Socket server initialized..!");
    this._io = new Server({
      cors: {
        allowedHeaders: "*",
        origin: "*",
      },
      adapter: createAdapter(redis),
    });
  }

  public initListeners() {
    const io = this._io;
    console.log("Socket Listeners initialized!");

    const userSockets = new Map();

    io.on("connect", (socket) => {
      console.log("New Socket Connected => ", socket.id);

      socket.on(USER_REGISTER, ({ userId }) => {
        userSockets.set(userId, socket.id);
      });

      socket.on(FRIEND_REQUEST, async ({ senderId, receiverId, message }) => {
        console.log(message + " From " + senderId);
      });

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
      socket.on(INCOMMING_MESSAGE, async (data) => {
        const { body, receiverIds } = data;

        console.log(
          "INCOMMING_MESSAGE ==> " +
            body.sender._id +
            " says " +
            body.content +
            " to " +
            receiverIds
        );

        await produceMessage(INCOMMING_MESSAGE, {
          body,
          receiverIds,
        });

        receiverIds.forEach((receiverId: string) => {
          const receiver = userSockets.get(receiverId);

          console.log("receiver => ", receiver);

          socket.to(receiver).emit(INCOMMING_MESSAGE, body);
        });
      });

      socket.on(INCOMMING_MESSAGE_READ, async (data) => {
        const { messageId, chatId, userId } = data;
        console.log(INCOMMING_MESSAGE_READ, data.messageId);

        try {
          const response = await fetch(
            `http://localhost:3000/api/messages/${chatId}`,
            {
              method: "PATCH",
              body: JSON.stringify({ chatId, messageId, userId }),
            }
          );
          const result = await response.json();
          console.log("INCOMMING_MESSAGE_READ API Response: ", result);
          socket.broadcast.emit(INCOMMING_MESSAGE_READ, data);
        } catch (error) {}

        
      });

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

export default SocketService;
