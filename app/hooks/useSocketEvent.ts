import { useEffect } from "react";
import { useSocket } from "../context/SocketProvider";
import { Message } from "../interfaces/interfaces";
import { INCOMMING_MESSAGE, INCOMMING_MESSAGE_READ } from "../constants/events";
import { Socket } from "socket.io-client";

const useSocketEvent = (
  chatId: string,
  socket: Socket,
  setMessages: (value: React.SetStateAction<Message[]>) => void
) => {
  useEffect(() => {
    if (!socket) return;

    socket.on(INCOMMING_MESSAGE, (newMessage: Message) => {
      console.log("Received INCOMMING_MESSAGE");

      if (newMessage.chatId === chatId) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    socket.on(
      INCOMMING_MESSAGE_READ,
      (data: { chatId: string; messageId: string }) => {
        if (data.messageId) {
          setMessages((prevMessages) => {
            return prevMessages.map((message) =>
              message.chatId === data.chatId &&
              message.messageId === data.messageId
                ? { ...message, isRead: true }
                : message
            );
          });
        } else {
          setMessages((prevMessages) => {
            return prevMessages.map((message) =>
              message.chatId === data.chatId
                ? { ...message, isRead: true }
                : message
            );
          });
        }
      }
    );

    return () => {
      socket.off(INCOMMING_MESSAGE);
      socket.off(INCOMMING_MESSAGE_READ);
    };
  }, [chatId, socket]);
};

export default useSocketEvent;
