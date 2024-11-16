import React, { memo, useEffect, useRef } from "react";
import MessageAttachments from "./MessageAttachments";
import moment from "moment";
import { useSession } from "next-auth/react";
import { Message } from "@/app/interfaces/interfaces";

interface Props {
  message: Message;
  onMessageRead: (messageId?: string, isRead?: boolean ) => void; // Callback for when message is read
}

const MessageCard = ({ message, onMessageRead }: Props) => {
  const { data: session } = useSession();
  const {
    sender: { _id: senderId, fullName },
    createdAt,
    attachments,
    content: messageContent,
    isRead,
    messageId,
    readBy,
  } = message;

  const isCurrentUserReceiver = (senderId: string): boolean => {
    return session?.user.id === senderId;
  };

  return (
    <div
      className={`chat ${
        isCurrentUserReceiver(senderId) ? "chat-end" : "chat-start"
      }`}
    >
      <div className="chat-header">
        {isCurrentUserReceiver(senderId) ? "Me" : fullName}
        <time className="text-xs opacity-50 ml-1">
          {moment(createdAt).fromNow()}
        </time>
      </div>

      <div className="chat-bubble">
        <div>
          {attachments.map(({ thumbnail_url, url }) => (
            <MessageAttachments key={url} url={url} />
          ))}
        </div>
        {messageContent}
      </div>

      {isCurrentUserReceiver(senderId) && (
        <div className="chat-footer">{isRead ? `Seen` : "Delivered"}</div>
      )}
    </div>
  );
};

export default memo(MessageCard);
