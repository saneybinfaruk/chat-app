"use client";

import { FriendItem } from "@/app/interfaces/interfaces";
import mongoose from "mongoose";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { RiDeleteBin2Fill } from "react-icons/ri";

interface Props {
  friend: FriendItem;
}
const FriendLayout = ({ friend }: Props) => {
  const { id, fullName, avatarUrl } = friend;
  const route = useRouter();

  const handleMessageClick = async () => {
    const response = await fetch("api/chats/private-chats", {
      method: "POST",
      body: JSON.stringify({ friendId: id }),
    });

    const { chatId } = await response.json();

    if (response.ok) route.push(`/messages/${chatId}`);
  };

  return (
    <div className="bg-violet-200 items-center py-2 px-3 pr-16 gap-2 my-2 inline-flex rounded-xl justify-between">
      <div className="flex items-center gap-2">
        <div className="avatar p-2">
          <div className="ring-primary w-14 rounded-full ring ring-offset-1">
            <img
              src={
                avatarUrl
                  ? avatarUrl
                  : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              }
            />
          </div>
        </div>
        <h1 className="font-semibold">{fullName}</h1>
      </div>

      <div className="flex items-center gap-2 justify-between">
        <button className="btn btn-sm btn-primary" onClick={handleMessageClick}>
          Message
        </button>
        <button className="btn btn-circle btn-ghost btn-sm">
          <RiDeleteBin2Fill size={20} />
        </button>
      </div>
    </div>
  );
};

export default FriendLayout;
