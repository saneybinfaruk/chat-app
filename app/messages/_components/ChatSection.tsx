"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface Props {
  chatId: string;
  chatName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadMessageCount: number;
}
const ChatSection = ({
  chatId,
  chatName,
  lastMessage,
  lastMessageTime,
  unreadMessageCount,
}: Props) => {
  const pathname = usePathname();
  return (
    <Link
      href={`/messages/${chatId}`}
      className={`flex justify-between items-center px-2 py-4 rounded-xl hover:bg-violet-100 transition-colors duration-200 gap-2 ${
        pathname === `/messages/${chatId}` ? "bg-violet-200" : "bg-white"
      } `}
    >
      <div className="flex gap-4">
        <div className="avatar">
          <div className="w-9 h-9 rounded-full object-cover">
            <img src="https://plus.unsplash.com/premium_photo-1669879825881-6d4e4bde67d5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D" />
          </div>
        </div>

        <div className="flex flex-col">
          <h3 className="text-sm font-semibold text-slate-700">{chatName}</h3>
          <p className="text-xs font-extralight line-clamp-2">{lastMessage}</p>
        </div>
      </div>

      <div className="flex flex-col gap-1 whitespace-nowrap">
        <time className="text-xs font-thin">{lastMessageTime}</time>
        {unreadMessageCount > 0 && (
          <div className="badge badge-secondary badge-sm self-end">
            {unreadMessageCount}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ChatSection;
