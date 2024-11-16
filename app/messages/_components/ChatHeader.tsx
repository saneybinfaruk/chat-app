import React, { forwardRef, useEffect, useState } from "react";
import { IoCallOutline } from "react-icons/io5";
import { BsCameraVideo } from "react-icons/bs";
import { FiMoreVertical } from "react-icons/fi";
import { chatById } from "@/app/mongodb/query/chat";
import { Chat } from "@/app/interfaces/interfaces";
import useChatInfo from "@/app/hooks/useChatInfo";

interface ChatHeaderProps {
  member: {
    _id: string;
    fullName: string;
    avatarUrl: string;
  }[];
  chatId: string;
}

const ChatHeader = ({ member = [], chatId }: ChatHeaderProps) => {
  const { chatInfo } = useChatInfo(chatId);

  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-violet-300">
      <div className="flex gap-4 items-center">
        <div className="avatar">
          <div className="w-12 h-12 rounded-full object-cover">
            <img
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="User Avatar"
            />
          </div>
        </div>
        <div>
          <h3 className="text-md font-semibold">
            {chatInfo?.groupChat ? chatInfo.groupName : member[0]?.fullName}
          </h3>
          {/* <p className="text-xs font-extralight">{member[0]?._id}</p> */}

          {chatInfo?.groupChat ? (
            <div className="avatar-group -space-x-3 rtl:space-x-reverse">
              {chatInfo.members.map((member) => (
                <div key={member._id} className="avatar">
                  <div className="w-6">
                    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                  </div>
                </div>
              ))}

              {chatInfo.members.length > 3 && (
                <div className="avatar placeholder">
                  <div className="bg-neutral text-neutral-content w-6">
                    <span className="text-xs">
                      +{chatInfo.members.length - 3}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs font-extralight">{member[0]?._id}</p>
          )}
        </div>
      </div>

      <div className="flex gap-8">
        <IoCallOutline size={24} />
        <BsCameraVideo size={24} />
        <FiMoreVertical size={24} />
      </div>
    </div>
  );
};

export default ChatHeader;
