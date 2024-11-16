import React from "react";
import { allFriendRequests } from "../mongodb/query/users";
import FriendRequestLayout from "./_components/FriendRequestLayout";

const Notifications = async () => {
  const allRequest = await allFriendRequests();

  return (
    <div>
      {allRequest.map((request) => (
        <FriendRequestLayout
          key={request.id}
          fullName={request.senderName}
          avatarUrl={request.senderAvatarUrl}
          id={request.id}
        />
      ))}
    </div>
  );
};

export default Notifications;
