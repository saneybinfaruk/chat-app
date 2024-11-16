"use client";
import React from "react";
import ChatSection from "./ChatSection";
import useUpdatedChat from "@/app/hooks/useUpdatedChat";
import moment from "moment";

interface Props {
  groups: any[];
}

const GroupChatList = ({ groups }: Props) => {
  const { chatData } = useUpdatedChat(groups);

  return (
    <div>
      {chatData?.map((chat, index) => (
        <React.Fragment key={chat.id}>
          <ChatSection
            chatId={chat.id}
            chatName={chat.groupName}
            lastMessage={chat.lastMessage?.content}
            lastMessageTime={moment(chat.lastMessage?.createdAt).fromNow()}
            unreadMessageCount={chat.unreadMessages}
          />
          {index < groups.length - 1 && <div className="divider p-0 m-0"></div>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default GroupChatList;
