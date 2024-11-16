import { getServerSession } from "next-auth";
import React from "react";
import { authOption } from "../auth/components/AuthOption";
import { allFriends } from "../mongodb/query/users";
import FriendLayout from "./_components/FriendLayout";
import { FriendItem } from "../interfaces/interfaces";

const Me = async () => {
  const session = await getServerSession(authOption);

  const friends = (await allFriends(session?.user?.id!)) as FriendItem[];



  return (
    <div className="flex flex-col gap-2">
      <div className="bg-violet-50  py-5 px-8 rounded-lg max-w-xl">
        <img src={session?.user?.image!} className="w-36" />

        <h1 className="text-lg font-semibold">{session?.user?.name}</h1>
        <h3 className="font-extralight">{session?.user?.email}</h3>
      </div>
      <section className="bg-violet-50  py-5 px-8 rounded-xl max-w-xl">
        <h1 className="text-lg font-semibold">Friends</h1>

        <div className="flex flex-col">
          {friends.length === 0 ? (
            <p>No friends!</p>
          ) : (
            friends?.map((friend) => (
              <FriendLayout key={friend.id} friend={friend} />
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Me;
