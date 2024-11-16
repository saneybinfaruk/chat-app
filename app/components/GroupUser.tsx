import React from "react";
import { IoMdClose } from "react-icons/io";
import { SelectedUser } from "../interfaces/interfaces";

interface Props {
  user: SelectedUser;
  handleRemoveUser: (userId: string) => void;
}
const GroupUser = ({ user, handleRemoveUser }: Props) => {
  const { id, avatarUrl, fullName } = user;
  return (
    <div className="flex bg-violet-500 text-white text-sm items-center gap-1 p-1 pr-2 rounded-full">
      <div className="avatar">
        <div className="w-8 h-8 rounded-full object-cover">
          <img src={avatarUrl ? avatarUrl : 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'} />
        </div>
      </div>
      <p>{fullName}</p>
      <button
        className="btn btn-circle btn-xs btn-ghost"
        onClick={() => handleRemoveUser(id)}
      >
        <IoMdClose size={20} />
      </button>
    </div>
  );
};

export default GroupUser;
