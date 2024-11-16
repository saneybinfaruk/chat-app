"use client";
import { INCOMMING_MESSAGE } from "@/app/constants/events";
import { useSocket } from "@/app/context/SocketProvider";
import useSocketEvent from "@/app/hooks/useSocketEvent";
import moment from "moment";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import ChatSection from "./ChatSection";
import useUpdatedChat from "@/app/hooks/useUpdatedChat";

interface Props {
  chats: any[];
}
const FriendChatList = ({ chats }: Props) => {
  // const pathname = usePathname();
  // const [chatData, setChatData] = useState(chats);

  // const socket = useSocket();

  // useEffect(() => {
  //   // Listen for the 'newMessage' event from the server
  //   console.log("Received INCOMMING_MESSAGE == Window");
  //   if (socket) {
  //     socket.on(INCOMMING_MESSAGE, (newMessage: any) => {
  //       const updatedChats = chatData.map((chat: any) => {
  //         // If the new message belongs to a chat in the list, update unread count
  //         if (chat.id === newMessage.chatId) {
  //           const isChatOpen = pathname === `/messages/${chat.id}`;
  //           return {
  //             ...chat,
  //             unreadMessages: isChatOpen ? 0 : chat.unreadMessages + 1, // Increment unread message count
  //             lastMessage: {
  //               content: newMessage.content,
  //               createdAt: newMessage.createdAt,
  //               sender: newMessage.sender,
  //             },
  //           };
  //         }
  //         return chat;
  //       });
  //       setChatData(updatedChats); // Update the state to trigger a re-render
  //     });
  //   }

  //   return () => {
  //     // Clean up the event listener when the component is unmounted
  //     if (socket) {
  //       socket.off(INCOMMING_MESSAGE);
  //     }
  //   };
  // }, [chatData, socket, pathname]);

  // useEffect(() => {
  //   const updatedChats = chatData.map((chat) => {
  //     if (pathname === `/messages/${chat.id}`) {
  //       return {
  //         ...chat,
  //         unreadMessages: 0, // Reset unread message count for the active chat
  //       };
  //     }
  //     return chat;
  //   });
  //   setChatData(updatedChats);
  // }, [pathname]);

  const { chatData } = useUpdatedChat(chats);

  return chatData?.map((chat, index) => (
    <div key={chat.id}>
      <ChatSection
        chatId={chat.id}
        chatName={chat.members[0]?.fullName}
        lastMessage={chat.lastMessage?.content}
        lastMessageTime={moment(chat.lastMessage?.createdAt).fromNow()}
        unreadMessageCount={chat.unreadMessages}
      />
      {/* <Link
        href={`/messages/${chat.id}`}
        className={`flex justify-between items-center px-2 py-4 rounded-xl hover:bg-violet-100 transition-colors duration-200 gap-2 ${
          pathname === `/messages/${chat.id}` ? "bg-violet-200" : "bg-white"
        } `}
      >
        <div className="flex gap-4">
          <div className="avatar">
            <div className="w-9 h-9 rounded-full object-cover">
              <img src="https://plus.unsplash.com/premium_photo-1669879825881-6d4e4bde67d5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D" />
            </div>
          </div>

          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-slate-700">
              {chat.members[0]?.fullName}
            </h3>
            <p className="text-xs font-extralight line-clamp-2">
              {chat.lastMessage?.content}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1 whitespace-nowrap">
          <time className="text-xs font-thin">
            {moment(chat.lastMessage?.createdAt).fromNow()}
          </time>
          {chat.unreadMessages > 0 && (
            <div className="badge badge-secondary badge-sm self-end">
              {chat.unreadMessages}
            </div>
          )}
        </div>
      </Link> */}

      {index < chats.length - 1 && <div className="divider p-0 m-0"></div>}
    </div>
    // <p key={index}>p</p>
  ));
};

export default FriendChatList;
