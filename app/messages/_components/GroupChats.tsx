import { authOption } from "@/app/auth/components/AuthOption";
import AddGroupDialog from "@/app/components/AddGroupDialog";
import { Chat } from "@/app/interfaces/interfaces";
import { allGroupChats } from "@/app/mongodb/query/chat";
import { getServerSession } from "next-auth";
import Link from "next/link";
import React from "react";
import FriendChatList from "./FriendChatList";
import ChatSection from "./ChatSection";
import GroupChatList from "./GroupChatList";

const GroupChats = async () => {
  const session = await getServerSession(authOption);
  const groups = await allGroupChats(session?.user?.id!);


  console.log(`User Id: ${session?.user.id} ==> ${groups}`);
  

  return (
    <div className="mx-1 px-3 pb-3 shadow-md shadow-violet-200 rounded-2xl border border-slate-100">
      <div className="flex items-center justify-between pt-2">
        <h3 className="text-lg font-semibold pb-1 px-2">Groups</h3>

        <AddGroupDialog />
      </div>

      <GroupChatList groups={groups!} />
    </div>
  );
};

export default GroupChats;
