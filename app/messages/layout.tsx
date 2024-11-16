import React, { ReactNode } from "react";
import ChatSearch from "./_components/ChatSearch";
import FriendChats from "./_components/FriendChats";
import GroupChats from "./_components/GroupChats";

const MessagesLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="grid grid-cols-12 w-full gap-8 h-full">
      <div className="col-span-4 flex flex-col gap-5 h-full overflow-y-auto">
        <ChatSearch />

        <div className="flex flex-col gap-6 h-full overflow-y-auto">
          <GroupChats />

          {/* <FriendChats /> */}
        </div>
      </div>
      <div className="col-span-8 relative h-full shadow-md shadow-violet-200 border border-slate-100 rounded-2xl">
        {children}
      </div>
    </div>
  );
};

export default MessagesLayout;
