import { authOption } from "@/app/auth/components/AuthOption";
import AddPeopleDialog from "@/app/components/AddPeopleDialog";
import { allPrivateChats } from "@/app/mongodb/query/chat";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import FriendChatList from "./FriendChatList";

const FriendChats = async () => {
  const session = await getServerSession(authOption);
  const chats = await allPrivateChats(session?.user.id!);

  return (
    <div className="mx-1 pb-3 px-3 mb-3 shadow-md shadow-violet-200 rounded-2xl border border-slate-100">
      <div className="flex items-center justify-between pt-2">
        <h3 className="text-lg font-semibold pb-1 px-2">People</h3>
        <AddPeopleDialog />
      </div>

      <FriendChatList chats={chats!} />
    </div>
  );
};

export default FriendChats;
