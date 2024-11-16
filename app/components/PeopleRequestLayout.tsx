import React from "react";
import { User } from "../interfaces/interfaces";
import { HiUserAdd } from "react-icons/hi";

interface Props {
  user: User;
  onClick: ()=>void
}
const PeopleRequestLayout = ({ user,onClick }: Props) => {
  const { avatarUrl, fullName, _id } = user;


  return (
    <div
      className={`flex items-center justify-between p-2 rounded-lg hover:bg-violet-100 transition-colors duration-200 my-1`}
    >
      <div className="flex items-center gap-3">
        <div className="avatar">
          <div className="w-10 h-10 rounded-full object-cover">
            <img
              src={
                avatarUrl
                  ? avatarUrl
                  : "https://cdn.pixabay.com/photo/2023/07/30/00/12/cat-8157889_1280.png"
              }
            />
          </div>
        </div>
        <h6>{fullName}</h6>
      </div>

      <button
        className="btn btn-circle btn-ghost btn-sm"
        onClick={onClick}
      >
        <HiUserAdd size={25} />
      </button>
    </div>
  );
};

export default PeopleRequestLayout;
