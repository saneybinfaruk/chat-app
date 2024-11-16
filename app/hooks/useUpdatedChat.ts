import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import { INCOMMING_MESSAGE } from "../constants/events";

const useUpdatedChat = (chats: any[]) => {
  const pathname = usePathname();
  const [chatData, setChatData] = useState(chats);

  const socket = useSocket();

  useEffect(() => {
    // Listen for the 'newMessage' event from the server
    console.log("Received INCOMMING_MESSAGE == Window");
    if (socket) {
      socket.on(INCOMMING_MESSAGE, (newMessage: any) => {
        const updatedChats = chatData.map((chat: any) => {
          // If the new message belongs to a chat in the list, update unread count
          if (chat.id === newMessage.chatId) {
            const isChatOpen = pathname === `/messages/${chat.id}`;
            return {
              ...chat,
              unreadMessages: isChatOpen ? 0 : chat.unreadMessages + 1, // Increment unread message count
              lastMessage: {
                content: newMessage.content,
                createdAt: newMessage.createdAt,
                sender: newMessage.sender,
              },
            };
          }
          return chat;
        });
        setChatData(updatedChats); // Update the state to trigger a re-render
      });
    }

    return () => {
      // Clean up the event listener when the component is unmounted
      if (socket) {
        socket.off(INCOMMING_MESSAGE);
      }
    };
  }, [chatData, socket, pathname]);

  useEffect(() => {
    const updatedChats = chatData.map((chat) => {
      if (pathname === `/messages/${chat.id}`) {
        return {
          ...chat,
          unreadMessages: 0, // Reset unread message count for the active chat
        };
      }
      return chat;
    });
    setChatData(updatedChats);
  }, [pathname]);

  return { chatData };
};

export default useUpdatedChat;
