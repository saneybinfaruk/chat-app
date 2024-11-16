"use client";
import React, { use, useEffect, useRef, useState } from "react";
import { FaUserGroup } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { GoPlus } from "react-icons/go";
import { Users } from "../constants/data";
import { FriendItem, SelectedUser, User } from "../interfaces/interfaces";
import { IoMdClose } from "react-icons/io";
import GroupUser from "./GroupUser";
import { assert } from "console";
import { useSession } from "next-auth/react";

const AddGroupDialog = () => {
  const [selectedUsers, setSelectedUsers] = useState<SelectedUser[]>([]);
  const [groupName, setGroupName] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [friends, setFriends] = useState<FriendItem[]>([]);
  const { data: session } = useSession();
  const [error, setError] = useState<{
    errorStatus: boolean;
    errorMessage: string;
  }>({ errorStatus: false, errorMessage: "" });

  const modal = useRef<HTMLDialogElement>(null);

  const handleAddUser = (user: SelectedUser) => {
    if (!selectedUsers.includes(user)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  const handleReset = () => {
    setGroupName('')
    setSelectedUsers([]);
  };

  const handleCreateGroup = async () => {
    console.log(groupName);

    console.log(selectedUsers.map((users) => users.id));

    if (groupName.length < 2) {
      setError({
        ...error,
        errorStatus: true,
        errorMessage: "Group name should 2 character long!",
      });
      return;
    } else {
      setError({ ...error, errorStatus: false, errorMessage: "" });
    }

    if (selectedUsers.length < 2) {
      setError({
        ...error,
        errorStatus: true,
        errorMessage: "At least 2 members needed to create a group!",
      });
      return;
    } else {
      setError({ ...error, errorStatus: false, errorMessage: "" });
    }

    const response = await fetch("/api/chats/group-chats", {
      method: "POST",
      body: JSON.stringify({
        name: groupName,
        userId: session?.user?.id,
        members: selectedUsers.map((user) => user.id),
      }),
    });

    const result = await response.json();

    console.log(result);
  };

  useEffect(() => {
    const timeout = setTimeout(
      () => setError({ ...error, errorStatus: false, errorMessage: "" }),
      5000
    );

    return () => {
      clearTimeout(timeout); // Clears the timeout if `memberError` changes
    };
  }, [error]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const response = await fetch("/api/friends", {
          method: "POST",
          body: JSON.stringify({ userId: session?.user?.id }),
        });
        const result = await response.json();

        // Ensure result is an array
        if (Array.isArray(result)) {
          setFriends(result);
        } else {
          console.error("Friends data is not an array:", result);
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    getFriends();
  }, [session]);
  return (
    <div>
      <button
        className="btn btn-ghost"
        onClick={() => modal?.current?.showModal()}
      >
        <FaUserGroup />
        Create Group
      </button>

      <dialog id="my_modal_3" ref={modal} className="modal">
        <div className="modal-box p-0">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={handleReset}
            >
              ✕
            </button>
          </form>

          <div className="p-6 pb-1">
            <h3 className="font-bold text-lg">Create Group</h3>

            <input
              className="input input-primary my-3 w-full"
              placeholder="Group Name..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />

            {error.errorStatus && (
              <div role="alert" className="alert alert-error mb-2">
                <span>{error.errorMessage}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-1">
              {selectedUsers.map((user) => (
                <GroupUser
                  key={user.id}
                  user={user}
                  handleRemoveUser={handleRemoveUser}
                />
              ))}
            </div>

            <h3 className="font-semibold py-3">Add Member</h3>

            <label className="input input-bordered input-sm flex items-center gap-2 mb-2">
              <FiSearch color="#7C7C7C" />
              <input
                type="text"
                className="grow"
                placeholder="Find member by name"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </label>

            <div className="max-h-[400px] overflow-y-auto ">
              {friends?.map((user, index) => (
                <div
                  key={user.id}
                  className={`flex items-center justify-between p-2 rounded-lg hover:bg-violet-100 transition-colors duration-200 ${
                    selectedUsers.includes(user) ? "bg-violet-200" : "bg-white"
                  } my-1`}
                >
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-10 h-10 rounded-full object-cover">
                        <img
                          src={
                            user.avatarUrl
                              ? user.avatarUrl
                              : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                          }
                        />
                      </div>
                    </div>
                    <h6>{user.fullName}</h6>
                  </div>

                  {!selectedUsers.includes(user) && (
                    <button
                      className="btn btn-circle btn-ghost btn-sm"
                      onClick={() => handleAddUser(user)}
                    >
                      <GoPlus size={25} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between border-t-2 p-6">
            <button className="btn" onClick={handleReset}>
              Reset
            </button>
            <div className="flex gap-2">
              <button
                className="btn"
                onClick={() => {
                  setGroupName('')
                  modal?.current?.close();
                }}
              >
                Cancel
              </button>
              <button
                className="btn bg-violet-600 text-white hover:bg-violet-500"
                onClick={handleCreateGroup}
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AddGroupDialog;
