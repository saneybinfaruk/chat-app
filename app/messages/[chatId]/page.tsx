"use client";

import React, { useEffect, useRef, useState } from "react";
import { FaRegSmileWink } from "react-icons/fa";
import { GrAttachment } from "react-icons/gr";
import { HiOutlineCamera } from "react-icons/hi2";
import { IoSendSharp } from "react-icons/io5";
import ChatHeader from "../_components/ChatHeader";
import { useSession } from "next-auth/react";
import {
  INCOMMING_MESSAGE,
  INCOMMING_MESSAGE_READ,
} from "@/app/constants/events";
import { useSocket } from "@/app/context/SocketProvider";
import { v4 as uuidv4 } from "uuid";
import MessageCard from "../_components/MessageCard";
import SelectedFiles from "../_components/SelectedFiles";
import useFetchMessages from "@/app/hooks/useFetchMessages";
import useSocketEvent from "@/app/hooks/useSocketEvent";
import useMessageScroll from "@/app/hooks/useMessageScroll";
import MessageModel from "@/app/mongodb/models/message-model";
import { updateMessagesAsRead } from "@/app/mongodb/query/messages";
import useChatInfo from "@/app/hooks/useChatInfo";

const Messages = ({ params: { chatId } }: { params: { chatId: string } }) => {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<{ file: File; previewURL: string }[]>([]);
  const { data: session } = useSession();
  const { members, messages, setMessages, loading } = useFetchMessages(chatId);
  const socket = useSocket();
  useSocketEvent(chatId, socket!, setMessages);
  const { messagesEndRef } = useMessageScroll(messages);
  const { chatInfo } = useChatInfo(chatId);

 

  const sendMessage = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!socket) return;

    if (files.length === 0 && !message.trim()) return;

    // Create a new FormData object
    const formData = new FormData();

    // Add the chat message details
    formData.append("chatId", chatId);
    formData.append("content", message.trim());
    formData.append(
      "sender",
      JSON.stringify({
        _id: session?.user.id,
        fullName: session?.user.name || "", // Fallback if not available
        avatarUrl: session?.user.image || "", // Fallback if not available
      })
    );

    // Attach selected files
    files.forEach((fileObj, index) => {
      formData.append(`files`, fileObj.file);
    });

    try {
      const response = await fetch(`/api/messages/${chatId}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.error("Failed to upload files");
        return;
      }

      const { filesUrl } = await response.json(); // Get the uploaded file data (URLs, etc.)

      const attachments = filesUrl.map(
        ({ thumbnail_url, url }: { thumbnail_url: string; url: string }) => ({
          thumbnail_url,
          url,
        })
      ) as { thumbnail_url: string; url: string }[];

      const body = {
        messageId: uuidv4(),
        chatId: chatId,
        content: message,
        isRead: false,
        sender: {
          _id: session?.user.id,
          fullName: session?.user.name || "", // Fallback if not available
          avatarUrl: session?.user.image || "", // Fallback if not available
        } as { _id: string; fullName: string; avatarUrl: string },
        attachments: attachments,
      };

      // console.log("body ===> ", body);
      // console.log("attachments ===> ", body.attachments);

      socket.emit(INCOMMING_MESSAGE, {
        body,
        receiverIds: chatInfo?.members?.map((member) => member._id),
      });

      // Optionally, add the message to the local state immediately
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...body, createdAt: new Date() },
      ]);
      setMessage(""); // Clear the input field
      setFiles([]);
    } catch (error) {}
  };

  const handleAttachementSelect = (e: any) => {
    const selectedFiles = Array.from(e.target.files) as File[]; // Convert FileList to an array
    const filePreviews = selectedFiles.map((file) => ({
      file,
      previewURL: URL.createObjectURL(file), // Generate preview URL for each file
    }));

    setFiles((prev) => [...prev, ...filePreviews]);
  };

  const onMessageRead = (messageId?: string, isRead?: boolean) => {
    // if (isRead) return;

    socket?.emit(INCOMMING_MESSAGE_READ, {
      chatId,
      messageId: messageId ? messageId : "",
      userId: session?.user.id,
    });
  };

  useEffect(() => {
    onMessageRead("");
  }, [chatId]);

  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!messageRef.current) return; // Early return if already read

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.sender._id === session?.user.id) return;
            if (!lastMessage.isRead) {
              // Mark the last message as read
              onMessageRead(lastMessage.messageId, lastMessage.isRead);
            }
            // Stop observing once the message is marked as read
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 1 } // Trigger when 100% of the message is visible
    );

    observer.observe(messageRef.current);

    return () => {
      if (messageRef.current) {
        observer.unobserve(messageRef.current); // Clean up observer when component unmounts
      }
    };
  }, [messages]); // Add relevant dependencies

  if (loading) return <p>Loading....</p>;
  return (
    <div className="flex flex-col h-screen relative">
      <ChatHeader chatId={chatId} member={members!} />

      <div className="overflow-y-auto flex flex-col px-6 h-full gap-2">
        {messages?.map((message, index) => {
          const isLastMessage = index === messages.length - 1;
          return (
            <div
              key={uuidv4()}
              ref={isLastMessage ? messageRef : null} // Attach ref to last message only
            >
              <MessageCard message={message} onMessageRead={onMessageRead} />
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-4 py-2 px-6">
        <div className="flex items-center gap-4 rounded-2xl bg-violet-100 w-full px-4">
          <div className="lg:tooltip" data-tip="Attach a file">
            <GrAttachment
              size={28}
              className="cursor-pointer p-1 rounded-full hover:bg-violet-300 transition-colors duration-300"
              onClick={() => {
                if (inputFileRef.current) {
                  inputFileRef.current.click();
                }
              }}
            />
            <input
              type="file"
              id="fileInput"
              multiple
              accept="image/jpeg, image/png, image/gif, image/bmp, image/webp, video/mp4, video/mov, audio/mp3, audio/wav, application/pdf"
              style={{ display: "none" }} // Hide the input field
              onChange={handleAttachementSelect}
              ref={inputFileRef}
            />
          </div>

          <div className="w-full">
            {files.length > 0 && (
              <SelectedFiles files={files} setFiles={setFiles} />
            )}

            <div className="flex items-center gap-2">
              <input
                type="text"
                className="grow p-2 rounded-lg outline-none bg-transparent"
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.currentTarget.value)}
              />

              <FaRegSmileWink
                size={22}
                onClick={() => {}}
                className="cursor-pointer"
              />
              <HiOutlineCamera
                size={22}
                onClick={() => {}}
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>

        <button className="btn btn-secondary" onClick={() => sendMessage()}>
          <IoSendSharp size={18} color="white" />
        </button>
      </div>
    </div>
  );
};

export default Messages;
