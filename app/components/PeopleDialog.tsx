"use client";
import React, { useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { User } from "../interfaces/interfaces";
import DialogBtn from "./DialogBtn";
import PeopleRequestLayout from "./PeopleRequestLayout";
import { useSession } from "next-auth/react";
// import { useSocket } from "../context/SocketProvider";

const PeopleDialog = ({ users }: { users: User[] }) => {
  const modal = useRef<HTMLDialogElement>(null);

  const [searchedUser, setSearchedUser] = useState("");
  const filteredUser = users.filter((user) =>
    user.fullName.toLowerCase().includes(searchedUser)
  );

  const { data: session } = useSession();
  // const { sendFriendRequest } = useSocket();

  const handleOnClick = async (receiverId: string) => {
    const body = {
      senderId: session?.user?.id!,
      receiverId: receiverId,
    };

    const resposne = await fetch("api/friends/send-request", {
      method: "PUT",
      body: JSON.stringify(body),
    });

    const result = await resposne.json();

    if (result.success) {
      // sendFriendRequest(
      //   session?.user.id!,
      //   receiverId,
      //   "You got a friend request!"
      // );
      // registerUserToSocket(session?.user?.id!);
    }
  };

  return (
    <div>
      <DialogBtn
        title="Add People"
        onClick={() => modal?.current?.showModal()}
      />
      <dialog id="my_modal_3" ref={modal} className="modal">
        <div className="modal-box p-0">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>

          <div className="p-6 pb-4">
            <h3 className="font-bold text-lg pb-2">Add People</h3>

            <label className="input input-bordered input-sm flex items-center gap-2">
              <FiSearch color="#7C7C7C" />
              <input
                type="text"
                className="grow"
                placeholder="Find people by name"
                value={searchedUser}
                onChange={(e) => setSearchedUser(e.target.value.toLowerCase())}
              />
            </label>

            <div className="max-h-[400px] overflow-y-auto py-2">
              {filteredUser.map((user) => (
                <PeopleRequestLayout
                  key={user._id}
                  user={user}
                  onClick={() => handleOnClick(user._id)}
                />
              ))}
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default PeopleDialog;
